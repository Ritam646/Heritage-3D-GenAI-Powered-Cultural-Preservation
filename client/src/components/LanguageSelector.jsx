import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/language-context';

export default function LanguageSelector() {
  const { currentLanguage, languages, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectLanguage = (code) => {
    changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 px-2"
          aria-label="Select language"
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium">
            {languages[currentLanguage].name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {Object.values(languages).map((language) => (
          <DropdownMenuItem
            key={language.code}
            className={`flex items-center gap-2 ${
              currentLanguage === language.code ? 'bg-muted' : ''
            }`}
            onClick={() => handleSelectLanguage(language.code)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 w-full"
            >
              <span className="text-sm">{language.name}</span>
              {currentLanguage === language.code && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-2 h-2 rounded-full bg-primary ml-auto"
                />
              )}
            </motion.div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}