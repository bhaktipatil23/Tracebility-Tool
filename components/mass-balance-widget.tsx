"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { validateMassBalance, formatWeight } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface MassBalanceWidgetProps {
  inputKg: number;
  outputs: Record<string, number>;
  tolerance?: number;
  className?: string;
}

export function MassBalanceWidget({ 
  inputKg, 
  outputs, 
  tolerance = 0.2, 
  className 
}: MassBalanceWidgetProps) {
  const totalOutputKg = Object.values(outputs).reduce((sum, kg) => sum + kg, 0);
  const delta = Math.abs(inputKg - totalOutputKg);
  const isValid = validateMassBalance(inputKg, totalOutputKg, tolerance);
  const percentageUsed = inputKg > 0 ? (totalOutputKg / inputKg) * 100 : 0;

  return (
    <Card className={cn('', className)}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Mass Balance</h3>
            <div className="flex items-center space-x-1">
              {isValid ? (
                <CheckCircle className="h-4 w-4" style={{ color: '#f7f1ee' }} />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <span className={cn(
                "text-xs font-medium",
                isValid ? "text-[#333] dark:text-[#f7f1ee]" : "text-red-700 dark:text-red-400"
              )}>
                {isValid ? 'Valid' : 'Invalid'}
              </span>
            </div>
          </div>

          <Progress 
            value={Math.min(percentageUsed, 100)} 
            className={cn(
              "h-2",
              isValid ? "text-[#333]" : "text-red-600"
            )}
          />

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <div className="text-gray-500 dark:text-gray-400">Input</div>
              <div className="font-medium">{formatWeight(inputKg)}</div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">Output</div>
              <div className="font-medium">{formatWeight(totalOutputKg)}</div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">Delta</div>
              <div className={cn(
                "font-medium",
                isValid ? "text-[#333]" : "text-red-600"
              )}>
                {formatWeight(delta)}
              </div>
            </div>
          </div>

          {!isValid && (
            <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
              Mass imbalance exceeds tolerance of ±{tolerance} kg
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}