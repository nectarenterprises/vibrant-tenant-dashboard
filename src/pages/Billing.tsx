
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Info } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

// Mock subscription plans
const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'For small property portfolios',
    price: '$29',
    interval: 'month',
    features: [
      'Up to 5 properties',
      'Document storage',
      'Basic reporting',
      'Email support',
    ],
    isPopular: false,
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'For growing property portfolios',
    price: '$79',
    interval: 'month',
    features: [
      'Up to 20 properties',
      'Advanced document intelligence',
      'Comprehensive reporting',
      'Utility bill analysis',
      'Service charge management',
      'Priority support',
    ],
    isPopular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large property portfolios',
    price: '$199',
    interval: 'month',
    features: [
      'Unlimited properties',
      'Custom integrations',
      'Advanced analytics',
      'Dedicated account manager',
      'White-labeling options',
      '24/7 phone support',
    ],
    isPopular: false,
  },
];

// Mock invoice history
const invoices = [
  {
    id: 'INV-001',
    date: '2023-05-01',
    amount: '$79.00',
    status: 'Paid',
  },
  {
    id: 'INV-002',
    date: '2023-04-01',
    amount: '$79.00',
    status: 'Paid',
  },
  {
    id: 'INV-003',
    date: '2023-03-01',
    amount: '$79.00',
    status: 'Paid',
  },
];

export default function Billing() {
  const { user } = useAuth();
  // Mock current subscription - in a real app, fetch from backend
  const [currentPlan, setCurrentPlan] = React.useState('pro');
  const [isChangingPlan, setIsChangingPlan] = React.useState(false);

  const handleChangePlan = (planId: string) => {
    setIsChangingPlan(true);
    
    // Simulate API call
    setTimeout(() => {
      setCurrentPlan(planId);
      setIsChangingPlan(false);
      toast.success(`Successfully switched to ${subscriptionPlans.find(plan => plan.id === planId)?.name} plan`);
    }, 1500);
  };

  return (
    <div className="container py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground mt-2">
            Manage your subscription plan and billing information
          </p>
        </div>
        
        <Separator />
        
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>
              You are currently on the {subscriptionPlans.find(plan => plan.id === currentPlan)?.name} plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {subscriptionPlans.find(plan => plan.id === currentPlan)?.price}
                  <span className="text-muted-foreground text-sm font-normal">
                    /{subscriptionPlans.find(plan => plan.id === currentPlan)?.interval}
                  </span>
                </p>
                <p className="text-muted-foreground">Next billing date: June 1, 2023</p>
              </div>
              <Button variant="outline" onClick={() => toast.info("Payment method update would be implemented here")}>
                Update Payment Method
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.isPopular ? 'border-primary' : ''}`}>
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-md rounded-tr-md">
                    POPULAR
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    {plan.price}
                    <span className="text-muted-foreground text-sm font-normal">/{plan.interval}</span>
                  </p>
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={currentPlan === plan.id ? "outline" : "default"}
                    disabled={isChangingPlan || currentPlan === plan.id}
                    onClick={() => handleChangePlan(plan.id)}
                  >
                    {currentPlan === plan.id ? "Current Plan" : "Switch Plan"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>View and download your past invoices</CardDescription>
            </div>
            <Button variant="outline" onClick={() => toast.info("Invoice export would be implemented here")}>
              Export All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Invoice</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b">
                      <td className="py-3 px-4">{invoice.id}</td>
                      <td className="py-3 px-4">{invoice.date}</td>
                      <td className="py-3 px-4">{invoice.amount}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => toast.info("Invoice download would be implemented here")}>
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Need Help? <Info className="h-4 w-4" />
            </CardTitle>
            <CardDescription>
              Contact our billing support team for any questions about your subscription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Email us at <span className="font-medium">billing@sweetlease.com</span> or call <span className="font-medium">+1 (555) 123-4567</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
