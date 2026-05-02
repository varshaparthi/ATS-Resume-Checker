import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
export const meta:() => any =() =>([
    {title: 'Resumind  || Auth'},
    {name:'descriptin', content:'Log into youe accout'},
])
const Auth: () =>Element=() =>{
    const {isLoading,auth} =usePuterStore();
    const location  = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();
    useEffect(() =>{
          if(auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated])
    return (
        <main className="bg-[url('/images/bg-auth.svg')]bg-cover min-h-screen flex items-center justify-center">
            <div className="gradient-border shadow-lg">
                <section className="fle fle-col gap-6 bg-white rounded-2xl p-10">
                    <div className="fle flex-col items-center gap-2 text-center">
                        <h1>Welcome</h1>
                        <h2>Log in to Continue your job journey</h2>
                    </div>
                    <div>
                        {isLoading ? (
                            <button className="auth-button animate-pulse">
                                <p>Signing you in...</p>
                            </button>
                        ) : (
                            <>
                                 {auth.isAuthenticated ?(
                                    <button className="auth-button" onClick={auth.signOut}>
                                        
                                        <p>Log Out</p>
                                    </button>

                                 ) : (
                                     <button className="auth-button" onClick={auth.signIn}>
                                        <p>Log in</p>
                                    </button>
                                 )}
                            </>
                        )}

                        
                    </div>

                </section>
            </div>
        </main>
    )
}

export default Auth;