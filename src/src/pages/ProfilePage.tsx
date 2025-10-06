import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const ProfilePage = () => {
  const [profile, setProfile] = useState<{ name: string; email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data() as { name: string; email: string; role: string };
          setProfile(data);
          setEditName(data.name);
          setEditRole(data.role);
        } else {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleUpdate = async () => {
    setSaving(true);
    setSuccess(false);
    const auth = getAuth();
    const user = auth.currentUser;
    if (user && profile) {
      await setDoc(doc(db, "users", user.uid), {
        ...profile,
        name: editName,
        role: editRole,
      });
      setProfile({ ...profile, name: editName, role: editRole });
      setSuccess(true);
    }
    setSaving(false);
  };


  if (loading) return <div className="p-8 text-lg">Loading...</div>;
  if (!profile) return (
  <div className="p-8 text-lg text-center">
    Profile not found.<br />
    <button
      className="mt-4 px-4 py-2 rounded bg-cyber-blue text-black hover:bg-cyber-blue/80"
      onClick={async () => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          await setDoc(doc(db, "users", user.uid), {
            name: user.displayName || "Unnamed User",
            email: user.email || "",
            uid: user.uid,
            role: "Security Analyst",
            createdAt: new Date().toISOString()
          });
          window.location.reload();
        }
      }}
    >
      Create Profile
    </button>
  </div>
);

  return (
    <div className="max-w-md mx-auto mt-12 bg-cyber-dark rounded-lg shadow-lg p-8 text-center">
      <div className="flex flex-col items-center space-y-3">
        <div className="h-16 w-16 rounded-full bg-cyber-subtle flex items-center justify-center text-2xl font-bold">
          {editName.split(" ").map(n => n[0]).join("").toUpperCase()}
        </div>
        <div className="w-full mt-4">
          <label className="block text-left text-gray-400 mb-1">Name</label>
          <input
            type="text"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            className="w-full px-3 py-2 rounded bg-cyber-dark border border-cyber-blue/40 text-gray-200 mb-3 focus:outline-none focus:border-cyber-blue"
          />
          <label className="block text-left text-gray-400 mb-1">Role</label>
          <input
            type="text"
            value={editRole}
            onChange={e => setEditRole(e.target.value)}
            className="w-full px-3 py-2 rounded bg-cyber-dark border border-cyber-blue/40 text-gray-200 mb-3 focus:outline-none focus:border-cyber-blue"
          />
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="mt-2 px-4 py-2 rounded bg-cyber-blue text-black font-semibold hover:bg-cyber-blue/80 disabled:opacity-60 w-full"
          >
            {saving ? "Saving..." : "Update Profile"}
          </button>
          {success && <div className="text-green-400 mt-2">Profile updated!</div>}
        </div>
        <div className="mt-4 w-full">
          <p className="text-gray-400">Email:</p>
          <p className="text-gray-300 font-mono">{profile.email}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
