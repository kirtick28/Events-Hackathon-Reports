import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LockKeyholeIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import api from '../../utils/api';
import AuthPageLayout from '../../components/auth/AuthPageLayout';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match', { autoClose: 2000 });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(`/auth/update-password/${token}`, {
        newPassword
      });
      toast.success(res.data.message, { autoClose: 2000 });
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Password reset failed';
      toast.error(errorMessage, { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout
      title="Set New Password"
      subtitle="Enter your new password"
      icon={LockKeyholeIcon}
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* New Password */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="block w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 bg-gray-50 hover:bg-white"
          />
          <span
            onClick={togglePasswordVisibility}
            className="absolute right-4 top-11 cursor-pointer text-gray-500"
          >
            {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="block w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 bg-gray-50 hover:bg-white"
          />
          <span
            onClick={toggleConfirmPasswordVisibility}
            className="absolute right-4 top-11 cursor-pointer text-gray-500"
          >
            {showConfirmPassword ? (
              <EyeOffIcon size={20} />
            ) : (
              <EyeIcon size={20} />
            )}
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-all duration-200"
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Update Password'
          )}
        </button>
      </form>
    </AuthPageLayout>
  );
};

export default ResetPassword;
