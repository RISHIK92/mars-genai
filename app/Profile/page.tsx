"use client"

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Self-contained Profile component without external dependencies
const Profile: React.FC = () => {
    // User data state
    const [userData, setUserData] = useState({
        name: 'Varun Udata',
        email: 'varunudata@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        position: 'Product Designer',
        joinDate: 'January 2023',
        bio: 'Passionate product designer with 5+ years of experience in creating user-centered digital solutions. Specialized in UI/UX design and design systems.'
    });

    // Edit mode state
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState(userData);

    // Profile picture state
    const [avatarUrl, setAvatarUrl] = useState('https://th.bing.com/th/id/OIP.C37g9qEC0oJ3Dz35nelhcQHaFj?rs=1&pid=ImgDetMain');

    const handleSave = () => {
        setUserData(editData);
        setEditMode(false);
    };

    const handleCancel = () => {
        setEditData(userData);
        setEditMode(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Inline icon components to avoid external dependencies
    const UserIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );

    const MailIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    );

    const PhoneIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    );

    const MapPinIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );

    const BriefcaseIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="14" x="2" y="7" rx="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    );

    const CalendarIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
    );

    const EditIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );

    const SaveIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
        </svg>
    );

    const CameraIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
            <circle cx="12" cy="13" r="3" />
        </svg>
    );

    const ArrowLeftIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
        </svg>
    );

    // Inline Logo component
    const Logo = () => (
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-genai-purple rounded-md flex items-center justify-center">
                <span className="font-bold text-bluborder-red-">MA</span>
            </div>
            <span className="font-bold text-bluborder-red- text-xl">MarsAI</span>
        </div>
    );

    // Inline AnimatedBackground component
    const AnimatedBackground = () => (
        <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-genai-purple/20 rounded-full filter blur-3xl opacity-70"></div>
            <div className="absolute top-1/3 -left-20 w-60 h-60 bg-genai-purple/20 rounded-full filter blur-3xl opacity-70"></div>
            <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-genai-purple/30 rounded-full filter blur-3xl opacity-70"></div>
        </div>
    );

    // Inline Button component 
    const Button = ({
        children,
        variant = "default",
        className = "",
        onClick = () => { },
        ...props
    }: {
        children: React.ReactNode;
        variant?: "default" | "outline";
        className?: string;
        onClick?: () => void;
        [key: string]: any;
    }) => {
        const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 px-4 py-2";

        const variantStyles = {
            default: "bg-genai-purple hover:bg-genai-purple-dark text-bluborder-red-",
            outline: "border border-red-/20 hover:bg-genai-dark hover:text-genai-purple-light"
        };

        return (
            <button
                className={`${baseStyles} ${variantStyles[variant]} ${className}`}
                onClick={onClick}
                {...props}
            >
                {children}
            </button>
        );
    };

    // Inline Card components
    const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
        <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
            {children}
        </div>
    );

    const CardHeader = ({ children }: { children: React.ReactNode }) => (
        <div className="flex flex-col space-y-1.5 p-6">
            {children}
        </div>
    );

    const CardTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
        <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
            {children}
        </h3>
    );

    const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
        <div className={`p-6 pt-0 ${className}`}>
            {children}
        </div>
    );

    // Inline Input component
    const Input = ({
        className = "",
        ...props
    }: React.InputHTMLAttributes<HTMLInputElement>) => (
        <input
            className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            {...props}
        />
    );

    return (
        <div className="relative min-h-screen">
            {/* Animated Background */}
            <AnimatedBackground />

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header */}
                <header className="w-full p-4 glass-card bg-genai-dark-light/50 backdrop-blur-lg border-b border-red-/10">
                    <div className="container mx-auto flex justify-between items-center">

                        <Logo />
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 container mx-auto p-4 md:p-8 flex flex-col items-center">
                    <div className="max-w-4xl w-full glass-card rounded-xl p-6 backdrop-blur-lg">
                        {/* Profile Header - User info & avatar */}
                        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start mb-8">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-genai-purple/30 bg-genai-dark-lighter">
                                    <img
                                        src={avatarUrl}
                                        alt="User Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button
                                    className="absolute bottom-0 right-0 bg-genai-purple p-2 rounded-full hover:bg-genai-purple-dark transition-colors"
                                    title="Change avatar"
                                >
                                    {/* <CameraIcon /> */}
                                </button>
                            </div>

                            {/* User Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-2xl font-bold text-bluborder-red-">{userData.name}</h1>
                                <p className="text-genai-purple-light mt-1">{userData.position}</p>
                                <p className="text-red-border-red- mt-3">{userData.bio}</p>
                            </div>

                            {/* Edit Button */}
                            {!editMode ? (
                                <Button
                                    onClick={() => setEditMode(true)}
                                    variant="outline"
                                    className="gap-2"
                                >
                                    <EditIcon />
                                    Edit Profile
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleSave}
                                        variant="default"
                                        className="bg-genai-purple hover:bg-genai-purple-dark gap-2"
                                    >
                                        <SaveIcon />
                                        Save
                                    </Button>
                                    <Button
                                        onClick={handleCancel}
                                        variant="outline"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Profile Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Information */}
                            <Card className="bg-genai-dark-lighter/50 border-genai-dark-light backdrop-blur-md">
                                <CardHeader>
                                    <CardTitle className="text-xl text-bluborder-red- flex items-center gap-2">
                                        <UserIcon />
                                        Personal Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Full Name</label>
                                        {editMode ? (
                                            <Input
                                                name="name"
                                                value={editData.name}
                                                onChange={handleChange}
                                                className="bg-genai-dark border-gray-700"
                                            />
                                        ) : (
                                            <p className="text-bluborder-red-">{userData.name}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Email</label>
                                        <div className="flex items-center gap-2">
                                            <MailIcon />
                                            {editMode ? (
                                                <Input
                                                    name="email"
                                                    value={editData.email}
                                                    onChange={handleChange}
                                                    className="bg-genai-dark border-gray-700"
                                                />
                                            ) : (
                                                <p className="text-bluborder-red-">{userData.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Phone</label>
                                        <div className="flex items-center gap-2">
                                            <PhoneIcon />
                                            {editMode ? (
                                                <Input
                                                    name="phone"
                                                    value={editData.phone}
                                                    onChange={handleChange}
                                                    className="bg-genai-dark border-gray-700"
                                                />
                                            ) : (
                                                <p className="text-bluborder-red-">{userData.phone}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Location</label>
                                        <div className="flex items-center gap-2">
                                            <MapPinIcon />
                                            {editMode ? (
                                                <Input
                                                    name="location"
                                                    value={editData.location}
                                                    onChange={handleChange}
                                                    className="bg-genai-dark border-gray-700"
                                                />
                                            ) : (
                                                <p className="text-bluborder-red-">{userData.location}</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Professional Information */}
                            <Card className="bg-genai-dark-lighter/50 border-genai-dark-light backdrop-blur-md">
                                <CardHeader>
                                    <CardTitle className="text-xl text-bluborder-red- flex items-center gap-2">
                                        <BriefcaseIcon />
                                        Professional Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Position */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Position</label>
                                        <div className="flex items-center gap-2">
                                            <BriefcaseIcon />
                                            {editMode ? (
                                                <Input
                                                    name="position"
                                                    value={editData.position}
                                                    onChange={handleChange}
                                                    className="bg-genai-dark border-gray-700"
                                                />
                                            ) : (
                                                <p className="text-bluborder-red-">{userData.position}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Join Date */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Member Since</label>
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon />
                                            {editMode ? (
                                                <Input
                                                    name="joinDate"
                                                    value={editData.joinDate}
                                                    onChange={handleChange}
                                                    className="bg-genai-dark border-gray-700"
                                                />
                                            ) : (
                                                <p className="text-bluborder-red-">{userData.joinDate}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Bio</label>
                                        {editMode ? (
                                            <textarea
                                                name="bio"
                                                value={editData.bio}
                                                onChange={handleChange}
                                                rows={4}
                                                className="w-full rounded-md bg-genai-dark-lighter border border-gray-700 focus:border-genai-purple focus:ring-genai-purple px-3 py-2 text-bluborder-red-"
                                            />
                                        ) : (
                                            <p className="text-bluborder-red-">{userData.bio}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Account Settings */}
                        <Card className="bg-genai-dark-lighter/50 border-genai-dark-light backdrop-blur-md mt-6">
                            <CardHeader>
                                <CardTitle className="text-xl text-bluborder-red-">Account Settings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Button variant="outline" className="bg-transparent hover:bg-genai-dark hover:text-genai-purple-light">
                                        Change Password
                                    </Button>
                                    <Button variant="outline" className="bg-transparent hover:bg-genai-dark hover:text-genai-purple-light">
                                        Privacy Settings
                                    </Button>
                                    <Button variant="outline" className="bg-transparent hover:bg-genai-dark hover:text-genai-purple-light">
                                        Notifications
                                    </Button>
                                    <Button variant="outline" className="bg-transparent hover:bg-genai-dark hover:text-genai-purple-light">
                                        Connected Accounts
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>

                {/* Footer */}
                <footer className="w-full p-4 text-center text-gray-500 text-sm">
                    <p>© 2025 CloudAI. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default Profile;
