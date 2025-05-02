
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
  company_id: string;
  company?: {
    name: string;
  };
  sender?: {
    name: string;
    role: string;
  };
}

const MessageInbox: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Fetch messages where user is sender or receiver
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          company:company_id (
            name
          ),
          sender:sender_id (
            name,
            role
          )
        `)
        .or(`receiver_id.eq.${user.id},sender_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setMessages(data || []);
    } catch (error: any) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [user]);

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId)
        .eq('receiver_id', user?.id);
      
      if (error) throw error;
      
      // Update local state
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      ));
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message);
    
    // If user is receiver and message is unread, mark as read
    if (user?.id === message.receiver_id && !message.read) {
      markAsRead(message.id);
    }
  };

  const handleBackToList = () => {
    setSelectedMessage(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p>Please sign in to view your messages</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchMessages} 
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {selectedMessage ? (
        <Card>
          <CardHeader className="pb-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-2 w-fit -ml-2" 
              onClick={handleBackToList}
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to messages
            </Button>
            <CardTitle className="text-lg">
              {selectedMessage.sender?.role === 'investor' ? 'Message about ' : 'Message from '} 
              {selectedMessage.company?.name}
            </CardTitle>
            <div className="flex items-center justify-between mt-1 text-sm text-gray-500">
              <span>From: {selectedMessage.sender?.name || 'Unknown'}</span>
              <span>{formatDate(selectedMessage.created_at)}</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="py-4">
                    <div className="h-5 bg-gray-200 rounded mb-2 w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((message) => (
                <Card 
                  key={message.id} 
                  className={`cursor-pointer transition-colors hover:border-gray-300 ${
                    user.id === message.receiver_id && !message.read 
                      ? 'border-l-4 border-l-[#ff4141]' 
                      : ''
                  }`}
                  onClick={() => handleSelectMessage(message)}
                >
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-[#ff4141]" />
                        <span className="font-medium">
                          {message.company?.name || 'Untitled Company'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(message.created_at)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-1 mb-2">
                      {user.id === message.sender_id ? 'To: ' : 'From: '}
                      {message.sender?.name || 'Unknown user'}
                    </p>
                    
                    <p className="text-sm truncate">
                      {message.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages</h3>
              <p className="text-gray-600">
                {user.role === 'investor' 
                  ? 'Start by contacting founders about their startups' 
                  : 'When investors contact you about your startup, messages will appear here'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageInbox;
