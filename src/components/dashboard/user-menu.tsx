import { LogOut } from "lucide-react";
import { signOut } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function UserMenu({ email }: { email: string }) {
  const initials = email.slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
      </Avatar>
      <span className="hidden text-sm text-muted-foreground sm:inline">
        {email}
      </span>
      <form action={signOut}>
        <Button variant="ghost" size="icon" type="submit" title="Sair">
          <LogOut className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
