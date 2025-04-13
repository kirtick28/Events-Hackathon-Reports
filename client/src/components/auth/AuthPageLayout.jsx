// src/components/auth/AuthPageLayout.jsx
import { LockIcon } from 'lucide-react';
import loginImage from '../../assets/images/collegeImage.jpg'; // ✅ Corrected import

const AuthPageLayout = ({ children, title, subtitle, icon }) => {
  const IconComponent = icon || LockIcon;

  return (
    <div className="min-h-screen w-full flex flex-row-reverse">
      {/* Left side - Form Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <IconComponent className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-500">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          className="absolute inset-0 h-full w-full object-cover transform hover:scale-105 transition-transform duration-[3000ms]"
          src={loginImage}
          alt="Digital Innovation"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/40 via-transparent to-black/50" />
        <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="transform hover:-translate-y-2 transition-transform duration-300">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Innovate Together
            </h2>
            <p className="text-lg text-yellow-100">
              Where technology meets imagination
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPageLayout;
