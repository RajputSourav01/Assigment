// file marked as a client component to use hooks and fetch apis freely.
"use client";

// import useState for rerender changes and shadcn ui component
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  // for email state , initial state was empty string, setEmail will update
  const [email, setEmail] = useState("");
  // for hold error or verified msg
  const [message, setMessage] = useState("");
  // for tracking authentication, initially false when data are available it will be update as true
  const [allowed, setAllowed] = useState(false);



  const checkEmail = async () => {
    setMessage("");
    const res = await fetch("/api/checking_email", {
      method: "POST",
      // header shows the type of request in the request body
      headers: { "Content-Type": "application/json" }, 

      // convert js object in to json string like - {email : ""}
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    // if email is registred setallowed to true and ternary operator will render rest part of form
    if (data.storekeyvaluepair) {
      setAllowed(true);
      setMessage("Email verified. You can proceed.");
    } else {
      setAllowed(false);
      setMessage("this email doesn't exist. Please enter valid email I'd.");
    }
  };

  // prevent brouser default form submission behaviour
  const handleSubmit = (behaviour: any) => {
    behaviour.preventDefault();
    // when user submit call checkemail function
    checkEmail();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Email Authentication Assignment</h1>
{/* using ternary operator if allowed is true then you will get rest form part */}
      {!allowed ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-64">
          <Input
            type="email"
            placeholder="Enter your registered email for continue"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit">Check Email</Button>
          {message && <p className="text-sm text-center">{message}</p>}
        </form>
      ) : (
        <div className="flex flex-col gap-3 w-64">
          <Input type="text" placeholder="Full Name" />
          <Input type="text" placeholder="Phone Number" />
          <Button type="submit">Submit Form</Button>
          <p className="text-green-600">{message}</p>
        </div>
      )}
    </div>
  );
}
