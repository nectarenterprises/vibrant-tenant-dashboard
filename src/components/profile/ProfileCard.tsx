
import React, { useState } from 'react';
import { User, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserRole } from '@/contexts/RoleContext';
import { ProfileData } from '@/types/profile';

interface ProfileCardProps {
  profile: ProfileData;
  roles: UserRole[];
  onSave: (formData: { firstName: string; lastName: string }) => Promise<void>;
  isLoading: boolean;
}

const ProfileCard = ({ profile, roles, onSave, isLoading }: ProfileCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setFormData({
      firstName: profile.firstName,
      lastName: profile.lastName,
    });
    setIsEditing(false);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          My Profile
        </CardTitle>
        <CardDescription>
          View and update your profile information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile.email || ''}
                disabled
                className="bg-slate-50"
              />
            </div>
            <div>
              <Label htmlFor="roles">Current Roles</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {roles.map((role) => (
                  <div key={role} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-sm">
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={!isEditing ? "bg-slate-50" : ""}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={!isEditing ? "bg-slate-50" : ""}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              {!isEditing ? (
                <Button 
                  type="button" 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={cancelEdit}
                    className="flex items-center"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="flex items-center"
                    disabled={isLoading}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
