import React, { useEffect, useState } from "react";

const API = "http://localhost:3000/api/users";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    image: null,

    // 🔥 NEW
    bio: "",
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  // 🔥 FETCH USER
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.success) {
          setUser(data.user);
          setForm({
            name: data.user.name,
            email: data.user.email,
            image: null,

            bio: data.user.bio || "",
            facebook: data.user.social?.facebook || "",
            instagram: data.user.social?.instagram || "",
            twitter: data.user.social?.twitter || "",
            youtube: data.user.social?.youtube || "",
          });
        }
      } catch {
        showToast("Failed to load user", "error");
      }
    };

    fetchUser();
  }, []);

  // IMAGE
  const handleImage = (file) => {
    if (!file) return;
    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
  };

  // UPDATE PROFILE
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);

      // 🔥 NEW
      fd.append("bio", form.bio);
      fd.append("facebook", form.facebook);
      fd.append("instagram", form.instagram);
      fd.append("twitter", form.twitter);
      fd.append("youtube", form.youtube);

      if (form.image) fd.append("image", form.image);

      const res = await fetch(`${API}/update-profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) return showToast(data.message, "error");

      showToast("Profile updated");
    } catch {
      showToast("Update failed", "error");
    }
  };

  // PASSWORD CHANGE
  const handlePassword = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!passwords.oldPassword || !passwords.newPassword) {
        return showToast("Fill all fields", "error");
      }

      const res = await fetch(`${API}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwords),
      });

      const data = await res.json();

      if (!res.ok) return showToast(data.message, "error");

      showToast("Password changed");

      setPasswords({
        oldPassword: "",
        newPassword: "",
      });
    } catch {
      showToast("Error", "error");
    }
  };

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      {/* 🌄 BACKGROUND */}
      <div className="fixed inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          className="w-full h-full object-cover"
          alt="bg"
        />
      </div>

      {/* 🔥 OVERLAY */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm -z-10"></div>

      {/* 🔔 TOAST */}
      {toast.show && (
        <div className="fixed top-20 right-5 z-50 w-80">
          <div
            className={`relative px-4 py-3 rounded-lg text-white shadow-lg
            ${toast.type === "success" ? "bg-[#32AEBB]" : "bg-[#F48C3C]"}`}
          >
            {toast.message}
            <div className="absolute bottom-0 left-0 h-1 bg-white/80 animate-progress"></div>
          </div>
        </div>
      )}

      {/* FORM */}
      <div className="max-w-2xl mx-auto p-4">

        <div className="bg-white rounded-2xl p-8 shadow-lg">

          <h2 className="text-2xl font-semibold mb-6 text-center">
            My Profile
          </h2>

          {/* IMAGE */}
          <div className="flex justify-center mb-6">
            <label className="cursor-pointer">
              <div className="w-24 h-24 rounded-full overflow-hidden border">
                <img
                  src={
                    preview
                      ? preview
                      : `http://localhost:3000/${user.image}`
                  }
                  className="w-full h-full object-cover"
                />
              </div>
              <input
                type="file"
                className="hidden"
                onChange={(e) => handleImage(e.target.files[0])}
              />
            </label>
          </div>

          {/* FORM */}
          <div className="space-y-6">

            <WaveInput
              label="Name"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
            />

            <WaveInput
              label="Email"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
            />

            {/* 🔥 TRAVELER ONLY */}
            {user.role === "traveler" && (
              <>
                <div className="wave-group">
                  <textarea
                    rows="2"
                    value={form.bio}
                    onChange={(e) => {
                      setForm({ ...form, bio: e.target.value });

                      // 🔥 AUTO HEIGHT
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                    className="input resize-y overflow-hidden focus:outline-none"
                  />

                  <label className={`label ${form.bio ? "active" : ""}`}>
                    {"Bio".split("").map((char, i) => (
                      <span key={i} className="label-char" style={{ "--index": i }}>
                        {char}
                      </span>
                    ))}
                  </label>
                </div>
                <WaveInput label="Facebook" value={form.facebook} onChange={(v) => setForm({ ...form, facebook: v })} />
                <WaveInput label="Instagram" value={form.instagram} onChange={(v) => setForm({ ...form, instagram: v })} />
                <WaveInput label="Twitter" value={form.twitter} onChange={(v) => setForm({ ...form, twitter: v })} />
                <WaveInput label="YouTube" value={form.youtube} onChange={(v) => setForm({ ...form, youtube: v })} />
              </>
            )}

            <button
              onClick={handleUpdate}
              className="w-full bg-[#32AEBB] text-white py-2 rounded-lg"
            >
              Update Profile
            </button>
          </div>

          {/* PASSWORD */}
          <div className="mt-10 space-y-6">

            <h3 className="text-lg font-medium">Change Password</h3>

            <WaveInput
              type="password"
              label="Old Password"
              value={passwords.oldPassword}
              onChange={(v) =>
                setPasswords({ ...passwords, oldPassword: v })
              }
            />

            <WaveInput
              type="password"
              label="New Password"
              value={passwords.newPassword}
              onChange={(v) =>
                setPasswords({ ...passwords, newPassword: v })
              }
            />

            <button
              onClick={handlePassword}
              className="w-full bg-[#F48C3C] text-white py-2 rounded-lg"
            >
              Change Password
            </button>
          </div>

        </div>
      </div>

      {/* STYLE */}
      <style>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-progress {
          animation: progress 3s linear forwards;
        }

        .wave-group {
          position: relative;
          margin-top: 20px;
        }

        .input {
          width: 100%;
          border: none;
          border-bottom: 2px solid #ccc;
          background: #f9fafb;
          padding: 12px 10px;
        }

        .label {
          position: absolute;
          left: 10px;
          top: 12px;
          color: #777;
          display: flex;
        }

        .label-char {
          transition: 0.2s;
          transition-delay: calc(var(--index) * 0.04s);
        }

        .input:focus ~ .label .label-char,
        .label.active .label-char {
          transform: translateY(-22px);
          font-size: 11px;
          color: #32AEBB;
        }
      `}</style>

    </div>
  );
};

export default Profile;

// 🌊 INPUT
const WaveInput = ({ label, value, onChange, type = "text" }) => (
  <div className="wave-group">
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input focus:outline-none"
    />
    <label className={`label ${value ? "active" : ""}`}>
      {label.split("").map((char, i) => (
        <span key={i} className="label-char" style={{ "--index": i }}>
          {char}
        </span>
      ))}
    </label>
  </div>
);