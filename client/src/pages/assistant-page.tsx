import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Bot, SendHorizontal, RefreshCw, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "Tell me about Qutub Minar",
  "Famous temples of South India",
  "Architectural styles of Rajasthan",
  "History of the Taj Mahal",
  "Buddhist caves in Maharashtra",
  "Importance of Konark Sun Temple"
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your Heritage Assistant. Ask me anything about India's cultural monuments, historical sites, or architectural marvels.",
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string = inputValue) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate API call to knowledge assistant
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Knowledge base responses - in production this would be a real AI assistant API call
      let assistantResponse = "";
      
      if (content.toLowerCase().includes('qutub minar')) {
        assistantResponse = "The Qutub Minar is a 73-meter tall minaret built in the early 13th century. Key facts about it include:\n\n• It's located in Delhi and is part of the Qutub Complex, a UNESCO World Heritage Site\n• Construction began under Qutb al-Din Aibak around 1192 and was completed by his successor Iltutmish\n• It's made of red sandstone and marble\n• The tower has five distinct stories, each with a projecting balcony\n• The surfaces are covered with intricate carvings and verses from the Quran\n• It's the tallest brick minaret in the world\n• The complex also includes the Iron Pillar of Delhi, which has withstood corrosion for over 1,600 years";
      } else if (content.toLowerCase().includes('taj mahal')) {
        assistantResponse = "The Taj Mahal is India's most iconic monument, built by Emperor Shah Jahan between 1631 and 1648. Some key facts:\n\n• It was built as a mausoleum for Shah Jahan's favorite wife, Mumtaz Mahal\n• Located on the southern bank of the Yamuna River in Agra\n• Constructed from white marble with inlays of semi-precious stones\n• The main dome reaches a height of 73 meters\n• It took approximately 20,000 artisans and craftsmen to complete\n• The complex includes gardens designed in the Persian charbagh style\n• The monument changes its appearance throughout the day as light conditions shift\n• It's one of the New Seven Wonders of the World and a UNESCO World Heritage Site";
      } else if (content.toLowerCase().includes('temple') || content.toLowerCase().includes('south india')) {
        assistantResponse = "South India is home to some of the most magnificent temples in the country. Famous temples include:\n\n• Meenakshi Temple (Madurai): Known for its towering gopurams covered with colorful sculptures of deities\n• Brihadeeswara Temple (Thanjavur): A UNESCO site with a 66-meter vimana (tower), one of the tallest in India\n• Rameshwaram Temple: Features the longest corridor of any Hindu temple with 1,212 pillars\n• Virupaksha Temple (Hampi): Part of the ancient Vijayanagara Empire ruins\n• Padmanabhaswamy Temple (Thiruvananthapuram): Contains vast treasures in its vaults\n• Shore Temple (Mahabalipuram): An 8th-century temple complex overlooking the Bay of Bengal\n\nThese temples exhibit Dravidian architecture characterized by pyramid-shaped towers, stone carvings, and large temple complexes with numerous halls and shrines.";
      } else if (content.toLowerCase().includes('rajasthan')) {
        assistantResponse = "Rajasthan features several distinctive architectural styles:\n\n• Rajput Architecture: Characterized by massive forts built on hills (like Amber Fort and Mehrangarh Fort), with blend of Hindu and Mughal elements\n• Jharokhas: Overhanging enclosed balconies used in palaces and havelis\n• Chhatris: Elevated, dome-shaped pavilions used as cenotaphs or memorial sites\n• Jali Work: Intricately carved stone screens that provide privacy while allowing air circulation\n• Step Wells (Baolis): Unique to the region, these ornate wells with steps leading down to the water\n• City Palace Architecture: Seen in Jaipur, Udaipur, and Jodhpur, combining Rajput, Mughal and even some European influences\n• Haveli Design: Elaborately decorated mansions with multiple courtyards and ornate facades\n\nThe use of local sandstone in various colors (red, pink, yellow) is distinctive to Rajasthani architecture.";
      } else {
        assistantResponse = "That's an interesting question about Indian heritage. India's architectural history spans thousands of years and includes diverse styles influenced by various dynasties, religions, and cultural exchanges. From ancient Buddhist caves to elaborate Hindu temples, from Indo-Islamic monuments to colonial structures, India's architectural landscape is incredibly rich. Would you like me to provide more specific information about a particular monument, time period, or architectural style?";
      }
      
      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem connecting to the knowledge assistant. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetConversation = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Hello! I'm your Heritage Assistant. Ask me anything about India's cultural monuments, historical sites, or architectural marvels.",
        timestamp: new Date()
      }
    ]);
    toast({
      title: "Conversation reset",
      description: "Starting a fresh conversation with the Heritage Assistant.",
    });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Heritage Knowledge Hub</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ask questions about Indian monuments, cultural traditions, historical events, and architectural styles.
          </p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card shadow-xl overflow-hidden border">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full liquid-gradient-button flex items-center justify-center relative overflow-hidden">
                  <Bot className="h-5 w-5 text-white relative z-10" />
                </div>
                <span className="ml-3 font-medium text-card-foreground">Heritage Assistant</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={resetConversation}
                title="Reset conversation"
              >
                <RefreshCw className="h-5 w-5 text-muted-foreground" />
              </Button>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="h-[400px] overflow-y-auto p-6" id="chat-container">
                <AnimatePresence initial={false}>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex mb-4 ${message.role === 'user' ? 'justify-end' : ''}`}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full liquid-gradient-button flex-shrink-0 flex items-center justify-center relative overflow-hidden">
                          <Bot className="h-4 w-4 text-white relative z-10" />
                        </div>
                      )}
                      
                      <div 
                        className={`mx-3 p-3 rounded-lg ${
                          message.role === 'assistant' 
                            ? 'bg-muted text-foreground rounded-tl-none' 
                            : 'bg-primary text-white rounded-tr-none'
                        } max-w-[80%]`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      
                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0 flex items-center justify-center">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex mb-4"
                    >
                      <div className="w-8 h-8 rounded-full liquid-gradient-button flex-shrink-0 flex items-center justify-center relative overflow-hidden">
                        <Bot className="h-4 w-4 text-white relative z-10" />
                      </div>
                      <div className="mx-3 p-4 rounded-lg bg-muted text-foreground rounded-tl-none max-w-[80%]">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-3 h-3 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-3 h-3 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </AnimatePresence>
              </div>
              
              <div className="p-4 border-t">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Ask about Indian heritage and monuments..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    className="pr-12"
                  />
                  <Button
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full h-8 w-8 liquid-gradient-button"
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !inputValue.trim()}
                  >
                    <SendHorizontal className="h-4 w-4 text-white relative z-10" />
                  </Button>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs rounded-full liquid-gradient-border"
                        onClick={() => handleSendMessage(question)}
                        disabled={isLoading}
                      >
                        {question}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 p-6 bg-muted/30 rounded-lg"
          >
            <h3 className="font-semibold text-xl mb-4">About the Heritage Knowledge Hub</h3>
            <p className="text-muted-foreground mb-4">
              The Heritage Knowledge Hub is powered by an AI assistant specially trained on information about India's rich cultural and architectural heritage. 
              It can provide details about:
            </p>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li>Historical monuments and their architectural features</li>
              <li>Cultural and religious significance of heritage sites</li>
              <li>Different architectural styles across various regions of India</li>
              <li>Historical events associated with important monuments</li>
              <li>Conservation efforts and historical preservation</li>
              <li>Traditional building techniques and materials</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
