"use client";

import React, { useState } from 'react';
import { Sidebar } from '../../components/Dashboard/Sidebar/Sidebar';
import { HomeView } from '../../components/Dashboard/Home/HomeView';
import { AccountView } from '../../components/Dashboard/Account/AccountView';
import { PortfolioView } from '../../components/Dashboard/Portfolio/PortfolioView';

function Dashboard() {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Open AI');
  const [activeSection, setActiveSection] = useState('home');

  const models = ['Open AI', 'Claude', 'Gemini', 'Llama 2'];

  const renderMainContent = () => {
    switch (activeSection) {
      case 'account':
        return <AccountView />;
      case 'portfolio':
        return <PortfolioView />;
      default:
        return (
          <HomeView
            selectedModel={selectedModel}
            isModelOpen={isModelOpen}
            setIsModelOpen={setIsModelOpen}
            setSelectedModel={setSelectedModel}
            models={models}
          />
        );
    }
  };

  return (
    <div className="min-h-screen text-gray-200">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="pl-64">
        <div className="p-8 min-h-screen flex items-center justify-center">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;