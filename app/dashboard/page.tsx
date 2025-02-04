"use client";

import React, { useState } from 'react';
import { Sidebar } from '../../components/Dashboard/Sidebar/Sidebar';
import { HomeView } from '../../components/Dashboard/Home/HomeView';
import { AccountView } from '../../components/Dashboard/Account/AccountView';
import { PortfolioView } from '../../components/Dashboard/Portfolio/PortfolioView';
import { ChatInterface } from '@/components/Dashboard/Home/ChatInterface';

function Dashboard() {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Open AI');
  const [activeSection, setActiveSection] = useState('home');

  const models = ['Open AI', 'Claude', 'Gemini', 'Llama 2'];

  const renderMainContent = () => {
    switch (activeSection) {
      case 'chat':
        return (
          <div className="h-screen">
            <ChatInterface
              initialMessage=""
              selectedModel={selectedModel}
              models={models}
              onClose={() => setActiveSection('home')}
              setSelectedModel={setSelectedModel}
            />
          </div>
        );
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
        <div className="h-screen">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;