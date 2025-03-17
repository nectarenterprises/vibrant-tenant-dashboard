
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BadgeCheck, Heart, Lightbulb, Users } from 'lucide-react';

const AboutSection = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-lg">
              <p>
                As a property occupier myself, I experienced firsthand the frustrations of managing lease documents, tracking service charges, and staying on top of important dates.
              </p>
              <p>
                SweetLease was born from the belief that tenants deserve better tools to manage their property experience. Traditional property management software focuses on landlords, leaving tenants to deal with scattered documents and limited visibility.
              </p>
              <p>
                I created SweetLease to flip the script and give occupiers the power, visibility, and organization they need to take control of their tenancy.
              </p>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border border-border shadow-md">
            <div className="aspect-w-4 aspect-h-3 bg-gradient-to-br from-tenant-mint/40 to-tenant-sage/20 w-full h-64 flex items-center justify-center">
              <div className="text-center space-y-4">
                <Lightbulb className="h-16 w-16 text-tenant-green mx-auto" />
                <div className="text-2xl font-medium">From idea to reality</div>
              </div>
            </div>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <Users className="h-12 w-12 text-tenant-purple mx-auto mb-4" />
                <h3 className="text-xl font-bold">User-Centric</h3>
              </div>
              <p className="text-muted-foreground">
                We prioritize our users' needs in everything we build. SweetLease is designed with property occupiers at the center, ensuring features solve real problems they face.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <BadgeCheck className="h-12 w-12 text-tenant-teal mx-auto mb-4" />
                <h3 className="text-xl font-bold">Transparency</h3>
              </div>
              <p className="text-muted-foreground">
                We believe in bringing transparency to property management. Our platform makes it easy to understand service charges, utility costs, and lease conditions.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <Heart className="h-12 w-12 text-tenant-orange mx-auto mb-4" />
                <h3 className="text-xl font-bold">Simplicity</h3>
              </div>
              <p className="text-muted-foreground">
                Property management shouldn't be complicated. We focus on creating intuitive, straightforward solutions that save time and reduce stress.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-muted rounded-xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">The Problem We're Solving</h2>
            <p className="text-lg mb-8">
              Tenants and occupiers often lack visibility and control over their property experience. They struggle with:
            </p>
            <ul className="text-left space-y-4 mb-8 max-w-xl mx-auto">
              <li className="flex items-start">
                <span className="bg-tenant-green text-white rounded-full h-6 w-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
                <span>Scattered documents across email, paper files, and digital storage</span>
              </li>
              <li className="flex items-start">
                <span className="bg-tenant-green text-white rounded-full h-6 w-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
                <span>Opaque service charges without clear breakdowns or comparisons</span>
              </li>
              <li className="flex items-start">
                <span className="bg-tenant-green text-white rounded-full h-6 w-6 flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
                <span>Missing important lease dates like renewals, rent reviews, or break clauses</span>
              </li>
              <li className="flex items-start">
                <span className="bg-tenant-green text-white rounded-full h-6 w-6 flex items-center justify-center text-sm mr-3 mt-0.5">4</span>
                <span>Difficulty tracking utility usage and identifying potential savings</span>
              </li>
            </ul>
            <p className="text-lg">
              SweetLease brings everything together in one place, giving occupiers the information and tools they need to make better decisions about their property.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
