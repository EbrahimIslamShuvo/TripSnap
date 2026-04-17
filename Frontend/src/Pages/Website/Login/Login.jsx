import React, { useState, useEffect } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { Navigate } from "react-router-dom";

const Login = () => {

  const API = "http://localhost:3000/api/users";

  // LOADING
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // MAIN STATE
  const [view, setView] = useState("login");

  const [newPassword, setNewPassword] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);

  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);

  const [toast, setToast] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  useEffect(() => {
    let interval;
    if (showOTP && timer > 0) {
      interval = setInterval(() => setTimer((p) => p - 1), 1000);
    }
    if (timer === 0) setCanResend(true);
    return () => clearInterval(interval);
  }, [showOTP, timer]);

  const handleImage = (file) => {
    if (!file) return;
    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleOTP = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = async () => {
    try {

      // 🔐 LOGIN (NO OTP)
      if (view === "login") {
        if (!form.email) return showToast("Email is required");
        if (!emailRegex.test(form.email)) return showToast("Invalid email");
        if (!form.password) return showToast("Password required");

        const res = await fetch(`${API}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password
          })
        });

        const data = await res.json();

        // ❌ backend error
        if (!data.success) {
          return showToast(data.message);
        }

        // ✅ SUCCESS
        showToast("Login success ✅");

        // 🔥 TOKEN SAVE
        localStorage.setItem("token", data.token);

        // 🔥 REDIRECT
        window.location.href = "/tripsnap";

        return;
      }

      // 📝 REGISTER
      if (view === "register") {
        if (!form.name) return showToast("Name is required");
        if (!form.email) return showToast("Email is required");
        if (!emailRegex.test(form.email)) return showToast("Invalid email");
        if (!form.password) return showToast("Password is required");
        if (!form.image) return showToast("Image required");

        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("email", form.email);
        fd.append("password", form.password);
        fd.append("image", form.image);

        const res = await fetch(`${API}/register`, {
          method: "POST",
          body: fd
        });

        const data = await res.json();
        if (!res.ok) return showToast(data.message);

        setShowOTP(true);
        setTimer(120);
        setCanResend(false);

        showToast("OTP sent 📧");
        return;
      }

      // 🔑 FORGOT PASSWORD
      if (view === "forgot") {
        if (!form.email) return showToast("Email required");
        if (!emailRegex.test(form.email)) return showToast("Invalid email");

        const res = await fetch(`${API}/forgot-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: form.email
          })
        });

        const data = await res.json();
        if (!res.ok) return showToast(data.message);

        setShowOTP(true);
        setTimer(120);
        setCanResend(false);

        showToast("OTP sent 📧");
      }

    } catch (err) {

      showToast("Server error ❌");
      console.log(err);
      
    }
  };

  // 🔥 LOADING SCREEN
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">

        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>
        </div>

        <div className="relative text-center text-white">
          <h1 className="text-3xl font-bold animate-pulse">TripSnap</h1>
          <p className="mt-2 text-sm text-white/70">
            Preparing your experience...
          </p>

          <div className="mt-5 w-40 h-1 bg-white/20 rounded overflow-hidden">
            <div className="h-full bg-indigo-500 animate-loadingBar"></div>
          </div>
        </div>

        <style>{`
          @keyframes loadingBar {
            from { width: 0% }
            to { width: 100% }
          }
          .animate-loadingBar {
            animation: loadingBar 3s linear forwards;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center">

      {/* TOAST */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 w-72 animate-slideIn">
          <div className="bg-black text-white px-4 py-3 rounded-lg relative overflow-hidden">
            {toast}
            <div className="absolute bottom-0 left-0 h-1 bg-indigo-500 animate-progress"></div>
          </div>
        </div>
      )}

      {/* BG */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      </div>

      <div className="relative w-full max-w-5xl flex justify-between px-6">

        {/* FORM */}
        <form autoComplete="off" className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-white">

          {view === "register" && (
            <div className="flex justify-center mb-4">
              <label className="cursor-pointer">
                <div className="w-20 h-20 rounded-full border overflow-hidden">
                  {preview ? (
                    <img src={preview} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs">Upload</span>
                  )}
                </div>
                <input type="file" className="hidden"
                  onChange={(e) => handleImage(e.target.files[0])} />
              </label>
            </div>
          )}

          <h2 className="text-center mb-4">
            {view === "login" && "Login"}
            {view === "register" && "Register"}
            {view === "forgot" && "Reset Password"}
          </h2>

          {view === "register" && (
            <WaveInput label="Name" value={form.name}
              onChange={(v) => setForm({ ...form, name: v })} />
          )}

          <WaveInput label="Email" value={form.email}
            onChange={(v) => setForm({ ...form, email: v })} />

          {view !== "forgot" && view !== "reset" && (
            <WaveInput label="Password" type="password"
              value={form.password}
              onChange={(v) => setForm({ ...form, password: v })} />
          )}

          {!showOTP && view !== "reset" && (
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-white text-black py-2 mt-4 rounded-lg"
            >
              {view === "forgot" ? "Send OTP" : "Continue"}
            </button>
          )}

          {/* OTP */}
          {(view === "register" || view === "forgot") && showOTP && (
            <div className="mt-5 text-center">
              <p className="mb-2 text-sm">Enter OTP</p>

              <div className="flex justify-center gap-2">
                {otp.map((d, i) => (
                  <input key={i} id={`otp-${i}`} value={d}
                    maxLength="1"
                    className="w-10 h-10 text-center border rounded bg-transparent"
                    onChange={(e) => handleOTP(e.target.value, i)}
                    onKeyDown={(e) => handleBackspace(e, i)}
                  />
                ))}
              </div>

              <button
                type="button"
                className="w-full bg-indigo-500 mt-3 py-2 rounded"
                onClick={async () => {
                  const fullOtp = otp.join("");

                  if (fullOtp.length !== 4)
                    return showToast("Enter full OTP");

                  try {
                    const res = await fetch(`${API}/verify-otp`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        email: form.email,
                        otp: fullOtp,
                      }),
                    });

                    const data = await res.json();

                    if (!res.ok) return showToast(data.message || "Invalid OTP ❌");

                    // 🔥 IMPORTANT FIX
                    if (view === "forgot") {
                      showToast("OTP verified ✅");

                      setShowOTP(false);
                      setView("reset");
                      return;
                    }

                    if (view === "register") {
                      showToast("Account created successfully ✅");

                      setShowOTP(false);
                      setView("login");

                      setOtp(["", "", "", ""]);
                      return;
                    }

                  } catch {
                    showToast("Verification failed ❌");
                  }
                }}
              >
                Verify OTP
              </button>

              <p className="text-sm mt-2">
                {canResend ? (
                  <span onClick={() => {
                    setTimer(120);
                    setCanResend(false);
                    showToast("OTP resent 🔁");
                  }} className="cursor-pointer text-indigo-300">
                    Resend OTP
                  </span>
                ) : `Resend in ${timer}s`}
              </p>
            </div>

          )}

          {view === "reset" && (
            <div className="mt-5">
              <WaveInput
                label="New Password"
                type="password"
                value={newPassword}
                onChange={setNewPassword}
              />

              <button
                type="button"
                className="w-full bg-green-500 mt-3 py-2 rounded"
                onClick={async () => {
                  try {
                    const res = await fetch(`${API}/reset-password`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        email: form.email,
                        otp: otp.join(""),
                        newPassword,
                      }),
                    });

                    const data = await res.json();

                    if (!res.ok) return showToast(data.message);

                    showToast("Password updated ✅");

                    setView("login");
                    setOtp(["", "", "", ""]);

                  } catch {
                    showToast("Reset failed ❌");
                  }
                }}
              >
                Update Password
              </button>
            </div>
          )}

          {/* SWITCH */}
          <div className="text-sm mt-4 text-center">
            {view === "login" && (
              <>
                <p
                  onClick={() => {
                    setView("forgot");
                    setShowOTP(false);
                    setOtp(["", "", "", ""]);
                  }}
                  className="cursor-pointer"
                >
                  Forgot Password?
                </p>
                <p
                  onClick={() => {
                    setView("register");
                    setShowOTP(false);
                    setOtp(["", "", "", ""]);
                  }}
                  className="cursor-pointer"
                >
                  Create account
                </p>
              </>
            )}
            {view !== "login" && (
              <p
                onClick={() => {
                  setView("login");
                  setShowOTP(false);
                  setOtp(["", "", "", ""]);
                }}
                className="cursor-pointer"
              >
                Back to Login
              </p>
            )}
          </div>

        </form>

        {/* RIGHT */}
        <div className="hidden md:flex flex-col text-white">
          <h1 className="text-5xl font-bold leading-snug">
            THE GOAL OF LIFE IS <br />
            LIVING IN AGREEMENT <br />
            WITH NATURE.
          </h1>

          <div className="w-112 h-[3px] bg-white my-4"></div>

          <div className="flex gap-4 mt-4">
            <Icon><FaFacebookF /></Icon>
            <Icon><FaInstagram /></Icon>
            <Icon><FaTwitter /></Icon>
            <Icon><FaYoutube /></Icon>
          </div>
        </div>

      </div>

      {/* STYLE */}
      <style>{`
        @keyframes progress {from{width:100%}to{width:0}}
        .animate-progress{animation:progress 3s linear}
        @keyframes slideIn {
          from {transform:translateX(100%);opacity:0}
          to {transform:translateX(0);opacity:1}
        }
        .animate-slideIn {animation:slideIn .3s}

        .wave-group{position:relative;margin-top:18px}
        .wave-group .input{
          width:100%;border:none;border-bottom:1px solid #ccc;
          background:transparent;color:white;padding:10px 5px
        }
        .wave-group .input:focus{outline:none}
        .wave-group .label{
          position:absolute;left:5px;top:10px;color:#ccc;display:flex
        }
        .label-char{
          transition:.2s;transition-delay:calc(var(--index)*.05s)
        }
        .input:focus ~ label .label-char,
        .input:valid ~ label .label-char{
          transform:translateY(-20px);
          font-size:11px;color:#818cf8
        }
        .bar:before,.bar:after{
          content:'';position:absolute;height:2px;width:0;background:#818cf8;
          bottom:0;transition:.2s
        }
        .bar:before{left:50%}
        .bar:after{right:50%}
        .input:focus ~ .bar:before,
        .input:focus ~ .bar:after{width:50%}
      `}</style>
    </div>
  );
};

export default Login;

const WaveInput = ({ label, value, onChange, type = "text" }) => (
  <div className="wave-group">
    <input required type={type} value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input"
      autoComplete="new-password"
      name={Math.random()}
    />
    <span className="bar"></span>
    <label className="label">
      {label.split("").map((c, i) => (
        <span key={i} className="label-char" style={{ "--index": i }}>
          {c}
        </span>
      ))}
    </label>
  </div>
);



// ICON
const Icon = ({ children }) => (
  <div className="w-10 h-10 flex items-center justify-center bg-white hover:bg-transparent border border-white rounded-full text-black hover:text-white cursor-pointer hover:-translate-y-2 transition-all duration-500">
    {children}
  </div>
);