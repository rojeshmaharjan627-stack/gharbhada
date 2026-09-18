import { supabase } from './supabase.js';

let currentUser = null;

export async function initAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  currentUser = session?.user || null;

  supabase.auth.onAuthStateChange((event, session) => {
    currentUser = session?.user || null;
    window.dispatchEvent(new CustomEvent('auth-changed', { detail: { user: currentUser } }));
  });

  return currentUser;
}

export function getCurrentUser() {
  return currentUser;
}

export async function signUp({ email, password, fullName, phone }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone,
      },
    },
  });

  if (error) throw error;

  // If session is not returned directly, sign in immediately with credentials
  if (!data.session) {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!signInError && signInData.session) {
      currentUser = signInData.user;
      return signInData;
    }
  }

  currentUser = data.user;
  return data;
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  currentUser = data.user;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  currentUser = null;
}
