
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Button } from "@/components/ui/button";

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

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  if (loading) return <div className="p-8 text-lg text-center">Loading...</div>;
  if (!profile) return <div className="p-8 text-lg text-center">Profile not found.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-darker">
      <div className="glass-panel border border-cyber-blue/30 p-8 max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="h-16 w-16 rounded-full bg-cyber-blue/20 flex items-center justify-center text-3xl font-bold text-gray-200">
            {getInitials(editName || profile.name)}
          </div>
        </div>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleUpdate(); }}>
          <div>
            <label className="block text-left text-gray-400 mb-1 font-mono">Name</label>
            <input
              className="w-full px-4 py-2 rounded bg-cyber-dark border border-cyber-blue/30 text-gray-200 focus:outline-none focus:border-cyber-blue"
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-left text-gray-400 mb-1 font-mono">Role</label>
            <input
              className="w-full px-4 py-2 rounded bg-cyber-dark border border-cyber-blue/30 text-gray-200 focus:outline-none focus:border-cyber-blue"
              type="text"
              value={editRole}
              onChange={e => setEditRole(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mt-2 px-4 py-2 rounded bg-cyber-blue text-black font-semibold hover:bg-cyber-blue/80 disabled:opacity-60"
            disabled={saving}
          >
            {saving ? "Saving..." : "Update Profile"}
          </button>
          {success && <div className="text-green-400 mt-2">Profile updated!</div>}
          <div className="mt-4 w-full">
            <p className="text-gray-400">Email:</p>
            <p className="text-gray-300 font-mono">{profile.email}</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
