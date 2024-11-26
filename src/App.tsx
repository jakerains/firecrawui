import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { 
  Cog6ToothIcon, 
  CommandLineIcon, 
  MapIcon, 
  BugAntIcon,
  BeakerIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

import SettingsPanel from '@/components/panels/SettingsPanel';
import CrawlPanel from '@/components/panels/CrawlPanel';
import ScrapePanel from '@/components/panels/ScrapePanel';
import MapPanel from '@/components/panels/MapPanel';
import ExtractPanel from '@/components/panels/ExtractPanel';
import HistoryPanel from '@/components/panels/HistoryPanel';
import CrawlProgress from '@/components/CrawlProgress';

function App() {
  const [activeTab, setActiveTab] = useState('crawl');
  const [showProgress, setShowProgress] = useState(false);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleCrawlStart = () => {
    setShowProgress(true);
  };

  const handleCrawlComplete = () => {
    setShowProgress(false);
  };

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-[#0F172A] text-gray-100 p-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-gray-900" />
        <div className="fixed inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        
        <div className="relative z-10 max-w-6xl mx-auto space-y-12">
          <header className="text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative inline-block"
            >
              <h1 className="text-5xl font-bold tracking-tight pb-2">
                <span className="fire-text" data-text="Fire">Fire</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                  Crawler
                </span>
              </h1>
              <motion.p className="text-lg font-medium text-orange-500/80">
                Ignite Your Web Data Collection
              </motion.p>
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 via-red-500 to-purple-500"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-gray-400"
            >
              Blazing Fast Web Data Extraction Suite
            </motion.p>
          </header>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
            <div className="sticky top-4 z-50 backdrop-blur-xl bg-[#1f2937]/80 rounded-xl p-2 shadow-xl border border-[#374151]/50">
              <TabsList className="grid grid-cols-6 gap-2">
                <TabsTrigger value="crawl" className="tab-trigger tab-blue">
                  <BugAntIcon className="w-4 h-4" />
                  Crawl
                </TabsTrigger>
                <TabsTrigger value="scrape" className="tab-trigger tab-purple">
                  <CommandLineIcon className="w-4 h-4" />
                  Scrape
                </TabsTrigger>
                <TabsTrigger value="extract" className="tab-trigger tab-amber">
                  <BeakerIcon className="w-4 h-4" />
                  Extract
                </TabsTrigger>
                <TabsTrigger value="map" className="tab-trigger tab-emerald">
                  <MapIcon className="w-4 h-4" />
                  Map
                </TabsTrigger>
                <TabsTrigger value="history" className="tab-trigger tab-orange">
                  <ClockIcon className="w-4 h-4" />
                  History
                </TabsTrigger>
                <TabsTrigger value="settings" className="tab-trigger tab-slate">
                  <Cog6ToothIcon className="w-4 h-4" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>

            <AnimatePresence mode="wait">
              {showProgress ? (
                <CrawlProgress onComplete={handleCrawlComplete} />
              ) : (
                <>
                  <TabsContent value="crawl">
                    <CrawlPanel onCrawlStart={handleCrawlStart} />
                  </TabsContent>
                  <TabsContent value="scrape">
                    <ScrapePanel />
                  </TabsContent>
                  <TabsContent value="extract">
                    <ExtractPanel />
                  </TabsContent>
                  <TabsContent value="map">
                    <MapPanel />
                  </TabsContent>
                  <TabsContent value="history">
                    <HistoryPanel />
                  </TabsContent>
                  <TabsContent value="settings">
                    <SettingsPanel />
                  </TabsContent>
                </>
              )}
            </AnimatePresence>
          </Tabs>
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;