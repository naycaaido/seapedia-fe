import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { validateImageFile } from '../types';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import FeedbackBanner from '../components/ui/FeedbackBanner';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const ROLE_COLORS: Record<string, string> = {
  Admin: 'border-red-200 bg-red-50',
  Seller: 'border-blue-200 bg-blue-50',
  Buyer: 'border-emerald-200 bg-emerald-50',
  Driver: 'border-amber-200 bg-amber-50',
};

const ROLE_ICONS: Record<string, string> = {
  Admin: '#dc2626',
  Seller: '#2563eb',
  Buyer: '#059669',
  Driver: '#d97706',
};

export default function ProfilePage() {
  const { user, roles, activeRole, selectRole, uploadProfilePhoto } = useAuthStore();
  const navigate = useNavigate();
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoSuccess, setPhotoSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError(null);
    setPhotoSuccess(null);
    const error = validateImageFile(file);
    if (error) {
      setPhotoError(error);
      e.target.value = '';
      return;
    }
    setPhotoUploading(true);
    try {
      await uploadProfilePhoto(file);
      setPhotoSuccess('Profile photo updated.');
    } catch (err: any) {
      setPhotoError(err.message || 'Failed to upload photo.');
    } finally {
      setPhotoUploading(false);
      e.target.value = '';
    }
  };

  const roleBadgeVariant = (role: string) => {
    const map: Record<string, 'blue' | 'green' | 'yellow' | 'red' | 'purple'> = {
      Admin: 'red',
      Seller: 'blue',
      Buyer: 'green',
      Driver: 'yellow',
    };
    return map[role] || 'gray';
  };

  const handleSwitchRole = async (role: string) => {
    try {
      await selectRole(role);
      const links: Record<string, string> = {
        Admin: '/dashboard/admin',
        Seller: '/dashboard/seller',
        Buyer: '/dashboard/buyer',
        Driver: '/dashboard/driver',
      };
      navigate(links[role] || '/');
    } catch {
      // handled in store
    }
  };

  if (!user) return null;

  const userName = user.fullName || user.username;
  const initials = getInitials(userName);

  return (
    <div className="bg-[#f9f9ff] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
          <p className="text-base text-gray-500 mt-1">Manage your profile, roles, and preferences.</p>
        </div>

        {/* Profile Summary Card */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="flex flex-col items-center gap-3 shrink-0">
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={userName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-100"
                />
              ) : (
                <span className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-600 text-white text-xl sm:text-2xl font-bold shrink-0">
                  {initials}
                </span>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handlePhotoChange}
                disabled={photoUploading}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                loading={photoUploading}
              >
                {user.profileImageUrl ? 'Change Photo' : 'Upload Photo'}
              </Button>
            </div>
            <div className="min-w-0 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{user.fullName}</h2>
              <p className="text-sm text-gray-500 mt-0.5">@{user.username}</p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
              {activeRole && (
                <div className="mt-2 flex justify-center sm:justify-start">
                  <Badge variant={roleBadgeVariant(activeRole)} size="sm">
                    {activeRole}
                  </Badge>
                </div>
              )}
            </div>
          </div>
          {photoSuccess && (
            <div className="mt-4">
              <FeedbackBanner type="success" message={photoSuccess} onDismiss={() => setPhotoSuccess(null)} />
            </div>
          )}
          {photoError && (
            <div className="mt-4">
              <FeedbackBanner type="error" message={photoError} onDismiss={() => setPhotoError(null)} />
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Username</p>
                <p className="text-sm font-medium text-gray-900">{user.username}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</p>
                <p className="text-sm font-medium text-gray-900">{user.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
                <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                <p className="text-sm font-medium text-gray-900">{user.phone || '—'}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">
              Profile editing is not currently available. Contact support to update your details.
            </p>
          </div>

          {/* Roles */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Roles</h2>

            {/* Owned Roles */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Your Roles
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {roles.map((role) => {
                  const isActive = role === activeRole;
                  const colorClass = ROLE_COLORS[role] || 'border-gray-200 bg-gray-50';
                  const iconColor = ROLE_ICONS[role] || '#6b7280';
                  return (
                    <div
                      key={role}
                      className={`flex items-center gap-3 rounded-xl border p-4 ${
                        isActive ? colorClass + ' ring-2 ring-offset-1 ring-primary-500/20' : 'border-gray-200 bg-white'
                      }`}
                    >
                      <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{role}</p>
                        {isActive && (
                          <p className="text-xs font-medium text-primary-600 mt-0.5">Currently active</p>
                        )}
                      </div>
                      {isActive && (
                        <svg className="w-5 h-5 text-primary-600 ml-auto shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Switch Role */}
            {roles.length > 1 && (
              <div className="border-t border-gray-100 pt-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Switch Active Role
                </p>
                <div className="flex flex-wrap gap-3">
                  {roles.filter((r) => r !== activeRole).map((role) => (
                    <Button
                      key={role}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSwitchRole(role)}
                    >
                      Switch to {role}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
