// src/pages/auth/Login.jsx
import LoginForm from '../../components/auth/LoginForm';
import AuthPageLayout from '../../components/auth/AuthPageLayout';
import { LockIcon } from 'lucide-react';

const Login = () => {
  return (
    <AuthPageLayout
      title="Welcome back"
      subtitle="Please enter your credentials to access the system"
      icon={LockIcon}
    >
      <LoginForm />
    </AuthPageLayout>
  );
};

export default Login;
