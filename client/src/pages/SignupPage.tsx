import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addUser } from "@/lib/jsonData";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EyeIcon, EyeOffIcon, CheckCircle, XCircle } from "lucide-react";

// Password validation
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

// Registration form schema
const registrationSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: passwordSchema,
  confirmPassword: z.string(),
  userType: z.enum(["customer", "vendor"], {
    required_error: "Please select a user type",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationValues = z.infer<typeof registrationSchema>;

export default function SignupPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  useAuth();

  const form = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "customer",
    },
  });

  // Password strength validation checks
  const hasMinLength = passwordValue.length >= 8;
  const hasUppercase = /[A-Z]/.test(passwordValue);
  const hasLowercase = /[a-z]/.test(passwordValue);
  const hasNumber = /[0-9]/.test(passwordValue);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(passwordValue);

  const onSubmit = async (data: RegistrationValues) => {
    setIsSubmitting(true);
    try {
      // Check if user already exists in JSON data
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find((user: any) => user.email === data.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      // Create new user with password
      const newUser = {
        username: data.username,
        email: data.email,
        password: data.password,
        firstName: data.username,
        lastName: '',
        isVendor: data.userType === "vendor"
      };
      
      // Debug: Log user data
      console.log('Creating user:', newUser);
      console.log('User type selected:', data.userType);
      console.log('isVendor flag:', newUser.isVendor);
      
      // Add user to JSON storage
      addUser(newUser);
      
      toast({
        title: "Registration successful!",
        description: `Account created as ${data.userType}. Please login with your credentials.`,
      });
      
      // Redirect to login page
      setTimeout(() => {
        setLocation('/login');
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to register. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-md mx-auto shadow-lg">
        <CardHeader className="space-y-1 relative">
          <Button 
            variant="ghost" 
            className="absolute top-0 right-0 hover:bg-transparent bg-transparent text-black" 
            size="icon" 
            onClick={() => setLocation("/")}
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Button>
          <CardTitle className="text-2xl font-bold text-center font-heading">Sign Up</CardTitle>
          <CardDescription className="text-center">
            Create an account to get started with Partyoria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Create a password" 
                          {...field} 
                          onChange={e => {
                            field.onChange(e);
                            setPasswordValue(e.target.value);
                          }}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent bg-transparent text-black"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Password strength indicators - only show when typing and hide when all requirements met */}
              {passwordValue && !(hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar) && (
                <div className="space-y-2 text-sm">
                  <p className="font-medium">Password must contain:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                    <div className="flex items-center">
                      {hasMinLength ? <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> : <XCircle className="h-4 w-4 text-red-500 mr-2" />}
                      <span>At least 8 characters</span>
                    </div>
                    <div className="flex items-center">
                      {hasUppercase ? <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> : <XCircle className="h-4 w-4 text-red-500 mr-2" />}
                      <span>Uppercase letter</span>
                    </div>
                    <div className="flex items-center">
                      {hasLowercase ? <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> : <XCircle className="h-4 w-4 text-red-500 mr-2" />}
                      <span>Lowercase letter</span>
                    </div>
                    <div className="flex items-center">
                      {hasNumber ? <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> : <XCircle className="h-4 w-4 text-red-500 mr-2" />}
                      <span>Number</span>
                    </div>
                    <div className="flex items-center">
                      {hasSpecialChar ? <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> : <XCircle className="h-4 w-4 text-red-500 mr-2" />}
                      <span>Special character</span>
                    </div>
                  </div>
                </div>
              )}
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showConfirmPassword ? "text" : "password"} 
                          placeholder="Confirm your password" 
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent bg-transparent text-black"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>I want to join as a</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="customer" id="customer" />
                          <label htmlFor="customer" className="cursor-pointer">Customer</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="vendor" id="vendor" />
                          <label htmlFor="vendor" className="cursor-pointer">Vendor</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-center text-sm">
            Already have an account?{" "}
            <a onClick={() => setLocation("/login")} className="text-brand-purple hover:underline cursor-pointer">
              Log in
            </a>
          </p>
          <p className="text-center text-xs text-gray-500">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}