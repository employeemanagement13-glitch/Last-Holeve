import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client for server-side
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for server-side operations
);

// Fallback to public key if service role key is not available
const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY 
  ? supabaseAdmin 
  : createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
    );

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { email } = await request.json();

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Email must contain @ symbol' },
        { status: 400 }
      );
    }

    if (email.length > 100) {
      return NextResponse.json(
        { error: 'Email must be maximum 100 characters' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existingEmail, error: checkError } = await supabase
      .from('contactemails')
      .select('email, status')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking existing email:', checkError);
    }

    // Handle existing email
    if (existingEmail) {
      if (existingEmail.status === 'active') {
        return NextResponse.json(
          { error: 'You are already subscribed!' },
          { status: 409 }
        );
      } else {
        // Reactivate subscription
        const { error: updateError } = await supabase
          .from('contactemails')
          .update({ 
            status: 'active',
            subscribed_at: new Date().toISOString()
          })
          .eq('email', email);

        if (updateError) {
          console.error('Error reactivating subscription:', updateError);
          throw updateError;
        }

        return NextResponse.json(
          { message: 'Welcome back! Your subscription has been reactivated.' }
        );
      }
    }

    // Insert new subscription
    const { error: insertError } = await supabase
      .from('contactemails')
      .insert({
        email: email.trim(),
        status: 'active',
        source: 'footer'
      });

    if (insertError) {
      // Check if it's a duplicate key error (race condition)
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'This email is already subscribed' },
          { status: 409 }
        );
      }
      
      console.error('Error inserting email:', insertError);
      throw insertError;
    }

    return NextResponse.json(
      { message: 'Thank you for subscribing to our newsletter!' },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Subscription API error:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Optional: Add GET method to check subscription status
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('contactemails')
      .select('email, status, subscribed_at')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ subscribed: false });
      }
      throw error;
    }

    return NextResponse.json({
      subscribed: data.status === 'active',
      status: data.status,
      subscribed_at: data.subscribed_at
    });

  } catch (error: any) {
    console.error('GET subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    );
  }
}