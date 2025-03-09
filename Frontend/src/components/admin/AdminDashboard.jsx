import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { MilestoneManager } from './MilestoneManager';
import { LessonManager } from './LessonManager';

export function AdminDashboard() {
  const tabs = ['Miljokazi', 'Materijali'];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Upravljanje Sadržajem</h1>
      
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                ${selected
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                }`
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel>
            <MilestoneManager />
          </Tab.Panel>
          <Tab.Panel>
            <LessonManager />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}