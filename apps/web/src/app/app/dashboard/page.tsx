import { LogoutButton } from '../../components/LogoutButton';
import { NotesPage } from '../../components/NotesPage';

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      Overview
      <LogoutButton />
      <NotesPage />
    </div>
  );
}
