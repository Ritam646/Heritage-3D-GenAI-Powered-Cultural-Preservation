import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Send, History, Sparkles, BookOpen, Landmark } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

const AssistantPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [heritageSites, setHeritageSites] = useState([]);
  const messagesEndRef = useRef(null);
  const toast = { toast: (config) => console.log('Toast:', config) };

  // Fetch available heritage sites when component mounts
  useEffect(() => {
    const fetchHeritageSites = async () => {
      try {
        const response = await apiRequest('GET', '/api/heritage/sites');
        const data = await response.json();
        setHeritageSites(data.sites || []);
      } catch (error) {
        console.error('Error fetching heritage sites:', error);
        toast({
          title: 'Error',
          description: 'Failed to load heritage sites. Please try again later.',
          variant: 'destructive',
        });
      }
    };

    fetchHeritageSites();
  }, []); // Remove the toast dependency to prevent infinite fetching

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await apiRequest('POST', '/api/heritage/details', { 
        site: inputValue 
      });
      const data = await response.json();

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || 'Sorry, I could not find information about that monument.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting monument information:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while retrieving information. Please try again later.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: 'Error',
        description: 'Failed to get monument information. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle site selection from the list
  const handleSiteSelect = (site) => {
    setInputValue(site);
  };

  // Add a welcome message when no messages exist
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-message',
          role: 'assistant',
          content: 'Welcome to the Heritage Monument Assistant! I can provide information about various Indian heritage sites. What monument would you like to learn about?',
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl mb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Sparkles className="mr-2 h-6 w-6 text-primary" />
          Heritage Monument Assistant
        </h1>
        <p className="text-muted-foreground">
          Explore the rich history of Indian monuments with our Gemini-powered AI assistant
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Sidebar - Site Selection */}
        <div className="md:col-span-1">
          <Card className="overflow-hidden sticky top-4">
            <div className="p-4 bg-muted/50">
              <h2 className="font-semibold flex items-center">
                <Landmark className="mr-2 h-4 w-4" />
                Heritage Sites
              </h2>
            </div>
            <CardContent className="p-0">
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search sites..."
                    className="pl-8"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>
              </div>
              <div className="max-h-[400px] overflow-y-auto p-2">
                {heritageSites.map((site, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="px-3 py-2 rounded-md cursor-pointer"
                    onClick={() => handleSiteSelect(site)}
                  >
                    {site.replace(/_/g, ' ').split(' ').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Area */}
        <div className="md:col-span-2">
          <Card className="flex flex-col h-[calc(100vh-200px)] min-h-[600px]">
            <Tabs defaultValue="chat" className="flex-1 flex flex-col h-full">
              <div className="px-4 py-2 border-b flex-shrink-0">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="chat" className="flex items-center">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center">
                    <History className="mr-2 h-4 w-4" />
                    History
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0 overflow-hidden h-full">
                <div className="flex-1 overflow-y-auto p-4 chat-messages">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`mb-4 ${
                          message.role === 'assistant'
                            ? 'mr-12'
                            : 'ml-12'
                        }`}
                      >
                        <div
                          className={`p-4 rounded-lg ${
                            message.role === 'assistant'
                              ? 'bg-muted/50 rounded-tl-none'
                              : 'bg-primary text-primary-foreground rounded-tr-none'
                          }`}
                        >
                          <div className="whitespace-pre-wrap">
                            {message.content}
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {message.role === 'assistant' ? 'AI Assistant' : 'You'} •{' '}
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </AnimatePresence>
                </div>

                <div className="p-4 border-t flex-shrink-0">
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Ask about a heritage monument..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                          Thinking...
                        </div>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </TabsContent>

              <TabsContent value="history" className="flex-1 overflow-hidden p-0 m-0 h-full">
                <div className="h-full overflow-y-auto p-4">
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <BookOpen className="h-12 w-12 mb-4 opacity-20" />
                    <h3 className="text-lg font-medium">Your conversation history</h3>
                    <p className="max-w-md">
                      Your recent conversations with the assistant will appear here
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssistantPage;