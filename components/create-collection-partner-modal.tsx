"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Check, User, Building, MapPin, Info } from 'lucide-react';

interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

interface PartnerFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone: string;
  password: string;
  confirmPassword: string;
  designation: string;
  organizationName: string;
  brandName: string;
  organizationType: string;
  dateOfEstablishment: string;
  pan: string;
  gst: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
  city: string;
  pinCode: string;
  collectionAddress: string;
  latitude: string;
  longitude: string;
  collectionState: string;
  collectionCity: string;
  collectionPinCode: string;
}

interface CreateCollectionPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const steps = [
  { id: 1, title: 'User Account', icon: User },
  { id: 2, title: 'Company Details', icon: Building },
  { id: 3, title: 'Facility Details', icon: MapPin }
];

export function CreateCollectionPartnerModal({ isOpen, onClose, onSuccess }: CreateCollectionPartnerModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [facilityImages, setFacilityImages] = useState<ImageFile[]>([]);
  const [safetyImages, setSafetyImages] = useState<ImageFile[]>([]);
  const [formData, setFormData] = useState<PartnerFormData>({
    firstName: '', middleName: '', lastName: '', email: '', phone: '', alternatePhone: '',
    password: '', confirmPassword: '', designation: '',
    organizationName: '', brandName: '', organizationType: '', dateOfEstablishment: '', pan: '', gst: '',
    addressLine1: '', addressLine2: '', state: '', city: '', pinCode: '',
    collectionAddress: '', latitude: '', longitude: '', collectionState: '', collectionCity: '', collectionPinCode: ''
  });

  const handleClose = () => {
    setCurrentStep(1);
    onClose();
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && formData.phone && formData.password && formData.confirmPassword);
      case 2:
        return !!(formData.organizationName && formData.organizationType && formData.pan && formData.gst && formData.addressLine1 && formData.addressLine2 && formData.state && formData.city && formData.pinCode);
      case 3:
        return !!(formData.collectionAddress && formData.collectionState && formData.collectionCity && formData.collectionPinCode);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      alert('Please fill all mandatory fields before proceeding.');
      return;
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Creating collection partner:', formData);
    alert('Collection partner created successfully!');
    onSuccess?.();
    handleClose();
  };

  const updateFormData = (field: keyof PartnerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (files: FileList | null, type: 'facility' | 'safety') => {
    if (!files) return;
    
    const maxFiles = type === 'facility' ? 5 : 3;
    const currentImages = type === 'facility' ? facilityImages : safetyImages;
    const setImages = type === 'facility' ? setFacilityImages : setSafetyImages;
    
    const newImages: ImageFile[] = [];
    const remainingSlots = maxFiles - currentImages.length;
    const filesToProcess = Math.min(files.length, remainingSlots);
    
    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i];
      const preview = URL.createObjectURL(file);
      const id = Math.random().toString(36).substr(2, 9);
      newImages.push({ file, preview, id });
    }
    
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id: string, type: 'facility' | 'safety') => {
    const setImages = type === 'facility' ? setFacilityImages : setSafetyImages;
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="min-h-screen flex items-start justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[900px] my-8 relative">
          <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">Create New Collection Partner</h1>
              <p className="text-sm text-gray-600">Follow the steps to create a complete collection partner profile</p>
            </div>
            <div className="flex items-center space-x-4 ml-6">
              <span className="text-xs text-gray-500 font-medium">Step {currentStep} of {steps.length}</span>
              <button
                onClick={handleClose}
                className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-gray-50">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow transition-all duration-300 ${
                      isCompleted ? 'bg-gradient-to-r from-[#01298a] to-blue-800 text-white shadow-blue-500/30' : 
                      isCurrent ? 'bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-blue-600/30' : 
                      'bg-white border-2 border-gray-200 text-gray-400 shadow-gray-200/50'
                    }`}>
                      {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <span className={`text-xs mt-1 font-medium ${
                      isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 mx-4">
                      <div className={`h-0.5 rounded-full transition-all duration-500 ${
                        isCompleted ? 'bg-gradient-to-r from-[#01298a] to-blue-800' : 'bg-gray-200'
                      }`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-4">
          {currentStep === 1 && (
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-50">
                <CardTitle>User Account</CardTitle>
                <p className="text-sm text-gray-600">Enter user account information</p>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex items-start space-x-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">User Account Information</p>
                      <p className="text-xs text-blue-700">Create the user account (this person will be the collection partner owner)</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" value={formData.firstName} onChange={(e) => updateFormData('firstName', e.target.value)} className="h-10" />
                  </div>
                  <div>
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input id="middleName" value={formData.middleName} onChange={(e) => updateFormData('middleName', e.target.value)} className="h-10" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" value={formData.lastName} onChange={(e) => updateFormData('lastName', e.target.value)} className="h-10" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => updateFormData('email', e.target.value)} className="h-10" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" value={formData.phone} onChange={(e) => updateFormData('phone', e.target.value)} className="h-10" />
                  </div>
                  <div>
                    <Label htmlFor="alternatePhone">Alternate Phone</Label>
                    <Input id="alternatePhone" value={formData.alternatePhone} onChange={(e) => updateFormData('alternatePhone', e.target.value)} className="h-10" />
                  </div>
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input id="password" type="password" value={formData.password} onChange={(e) => updateFormData('password', e.target.value)} className="h-10" />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={(e) => updateFormData('confirmPassword', e.target.value)} className="h-10" />
                  </div>
                  <div>
                    <Label htmlFor="designation">Designation</Label>
                    <Input id="designation" value={formData.designation} onChange={(e) => updateFormData('designation', e.target.value)} className="h-10" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-50">
                <CardTitle>Company Details</CardTitle>
                <p className="text-sm text-gray-600">Configure company details</p>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Company Information</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="organizationName">Organization Name *</Label>
                      <Input id="organizationName" value={formData.organizationName} onChange={(e) => updateFormData('organizationName', e.target.value)} className="h-10" />
                    </div>
                    <div>
                      <Label htmlFor="brandName">Brand Name</Label>
                      <Input id="brandName" value={formData.brandName} onChange={(e) => updateFormData('brandName', e.target.value)} className="h-10" />
                    </div>
                    <div>
                      <Label htmlFor="organizationType">Organization Type *</Label>
                      <select id="organizationType" value={formData.organizationType} onChange={(e) => updateFormData('organizationType', e.target.value)} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900">
                        <option value="">Select Type</option>
                        <option value="individual">Individual Collector</option>
                        <option value="company">Company/Organization</option>
                        <option value="cooperative">Cooperative Society</option>
                        <option value="ngo">NGO/Non-Profit</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="dateOfEstablishment">Date of Establishment</Label>
                      <Input id="dateOfEstablishment" type="date" value={formData.dateOfEstablishment} onChange={(e) => updateFormData('dateOfEstablishment', e.target.value)} className="h-10" />
                    </div>
                    <div>
                      <Label htmlFor="pan">PAN *</Label>
                      <Input id="pan" value={formData.pan} onChange={(e) => updateFormData('pan', e.target.value)} className="h-10" />
                    </div>
                    <div>
                      <Label>PAN Attachment *</Label>
                      <Input type="file" accept=".pdf,.jpg,.jpeg,.png" className="h-10" />
                    </div>
                    <div>
                      <Label htmlFor="gst">GST *</Label>
                      <Input id="gst" value={formData.gst} onChange={(e) => updateFormData('gst', e.target.value)} className="h-10" />
                    </div>
                    <div>
                      <Label>GST Image *</Label>
                      <Input type="file" accept=".pdf,.jpg,.jpeg,.png" className="h-10" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Registered Address</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="addressLine1">Address Line 1 *</Label>
                      <Input id="addressLine1" value={formData.addressLine1} onChange={(e) => updateFormData('addressLine1', e.target.value)} className="h-10" />
                    </div>
                    <div>
                      <Label htmlFor="addressLine2">Address Line 2 *</Label>
                      <Input id="addressLine2" value={formData.addressLine2} onChange={(e) => updateFormData('addressLine2', e.target.value)} className="h-10" />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <select id="state" value={formData.state} onChange={(e) => updateFormData('state', e.target.value)} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900">
                        <option value="">Select State</option>
                        <option value="maharashtra">Maharashtra</option>
                        <option value="gujarat">Gujarat</option>
                        <option value="karnataka">Karnataka</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <select id="city" value={formData.city} onChange={(e) => updateFormData('city', e.target.value)} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900">
                        <option value="">Select City</option>
                        <option value="mumbai">Mumbai</option>
                        <option value="pune">Pune</option>
                        <option value="bangalore">Bangalore</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="pinCode">PIN Code *</Label>
                      <Input id="pinCode" value={formData.pinCode} onChange={(e) => updateFormData('pinCode', e.target.value)} className="h-10" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-50">
                <CardTitle>Facility Details</CardTitle>
                <p className="text-sm text-gray-600">Create facility location details</p>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Collection Location</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="collectionAddress">Collection Address *</Label>
                      <Input id="collectionAddress" value={formData.collectionAddress} onChange={(e) => updateFormData('collectionAddress', e.target.value)} placeholder="Enter collection address" className="h-10" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input id="latitude" value={formData.latitude} onChange={(e) => updateFormData('latitude', e.target.value)} placeholder="Optional" className="h-10" />
                      </div>
                      <div>
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input id="longitude" value={formData.longitude} onChange={(e) => updateFormData('longitude', e.target.value)} placeholder="Optional" className="h-10" />
                      </div>
                      <div>
                        <Label htmlFor="collectionState">State *</Label>
                        <select id="collectionState" value={formData.collectionState} onChange={(e) => updateFormData('collectionState', e.target.value)} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900">
                          <option value="">Select State</option>
                          <option value="maharashtra">Maharashtra</option>
                          <option value="gujarat">Gujarat</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="collectionCity">City *</Label>
                        <select id="collectionCity" value={formData.collectionCity} onChange={(e) => updateFormData('collectionCity', e.target.value)} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900">
                          <option value="">Select City</option>
                          <option value="mumbai">Mumbai</option>
                          <option value="pune">Pune</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="collectionPinCode">PIN Code *</Label>
                        <Input id="collectionPinCode" value={formData.collectionPinCode} onChange={(e) => updateFormData('collectionPinCode', e.target.value)} placeholder="Enter 6-digit PIN code" className="h-10" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">Facility Images</h4>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{facilityImages.length}</span>
                    </div>
                    
                    {facilityImages.length === 0 ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        <div className="text-center">
                          <div className="text-gray-400 mb-2">
                            <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <div className="text-sm text-gray-600">
                            <label className="cursor-pointer font-medium text-[#01298a] hover:text-blue-800">
                              Upload facility images
                              <input 
                                type="file" 
                                className="sr-only" 
                                multiple 
                                accept="image/*" 
                                onChange={(e) => handleImageUpload(e.target.files, 'facility')}
                              />
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                              Upload up to 5 images
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm text-gray-600">{facilityImages.length}/5 images uploaded</span>
                          {facilityImages.length < 5 && (
                            <label className="cursor-pointer bg-[#01298a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
                              Add More
                              <input 
                                type="file" 
                                className="sr-only" 
                                multiple 
                                accept="image/*" 
                                onChange={(e) => handleImageUpload(e.target.files, 'facility')}
                              />
                            </label>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                          {facilityImages.map((image) => (
                            <div key={image.id} className="relative group">
                              <img 
                                src={image.preview} 
                                alt="Facility" 
                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(image.id, 'facility')}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">Safety Images</h4>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{safetyImages.length}</span>
                    </div>
                    
                    {safetyImages.length === 0 ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        <div className="text-center">
                          <div className="text-gray-400 mb-2">
                            <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <div className="text-sm text-gray-600">
                            <label className="cursor-pointer font-medium text-[#01298a] hover:text-blue-800">
                              Upload safety images
                              <input 
                                type="file" 
                                className="sr-only" 
                                multiple 
                                accept="image/*" 
                                onChange={(e) => handleImageUpload(e.target.files, 'safety')}
                              />
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                              Upload up to 3 images
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm text-gray-600">{safetyImages.length}/3 images uploaded</span>
                          {safetyImages.length < 3 && (
                            <label className="cursor-pointer bg-[#01298a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
                              Add More
                              <input 
                                type="file" 
                                className="sr-only" 
                                multiple 
                                accept="image/*" 
                                onChange={(e) => handleImageUpload(e.target.files, 'safety')}
                              />
                            </label>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {safetyImages.map((image) => (
                            <div key={image.id} className="relative group">
                              <img 
                                src={image.preview} 
                                alt="Safety" 
                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(image.id, 'safety')}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-4 py-2 text-sm rounded-lg"
          >
            Back
          </Button>
          
          <span className="text-xs text-gray-500 font-medium">
            {currentStep === 3 ? 'Ready to create collection partner' : 'Fill required partner information'}
          </span>
          
          <Button
            onClick={handleNext}
            disabled={!validateStep(currentStep)}
            className="bg-gradient-to-r from-[#01298a] to-blue-800 px-4 py-2 text-sm rounded-lg shadow hover:shadow-blue-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === 3 ? 'Create User' : 'Continue'}
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
}