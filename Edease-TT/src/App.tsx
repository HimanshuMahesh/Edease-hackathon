import React, { useState, useRef, useEffect } from 'react';
import { Brain, MessageSquare, Loader2, Download, Mic, MicOff } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';

interface TimeSlot {
  day: string;
  time: string;
  subject: string;
}

const genAI = new GoogleGenerativeAI('YOUR_API_KEY_HERE');

function App() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM'];
  
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        // Process the recognized command
        submitCommand(transcript);
      };
      recognition.onend = () => {
        setIsRecording(false);
      };
      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event);
        setIsRecording(false);
      };
      recognitionRef.current = recognition;
    } else {
      console.error("Speech recognition not supported in this browser.");
    }
  }, []);

  const exportTimetable = () => {
    let exportText = "EdEase Timetable\n\n";
    exportText += "Time," + days.join(",") + "\n";
    times.forEach(time => {
      const row = [time];
      days.forEach(day => {
        const slot = timeSlots.find(s => s.day === day && s.time === time);
        row.push(slot?.subject || "-");
      });
      exportText += row.join(",") + "\n";
    });
    
    const blob = new Blob([exportText], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'edease-timetable.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const getGeneralResponse = async (input: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `As an AI timetable assistant, respond to this message in a helpful and concise way: "${input}"
        Context: You are a timetable management assistant that can also engage in general conversation.
        Keep the response friendly and brief.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error getting general response:', error);
      return "I'm having trouble understanding that right now. Would you like help with your timetable?";
    }
  };

  const getOptimizationSuggestions = async (schedule: TimeSlot[]) => {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `As an AI timetable assistant, analyze this schedule and provide brief optimization suggestions:
        ${JSON.stringify(schedule, null, 2)}
        Consider:
        1. Distribution of subjects
        2. Break times
        3. Subject difficulty levels
        Keep the response concise and practical.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error getting optimization suggestions:', error);
      return 'I encountered an error while analyzing the schedule. Please try again.';
    }
  };

  const findAvailableSlot = (targetDays: string[], startTime: string, endTime?: string): { day: string; time: string } | null => {
    const startIndex = times.indexOf(startTime);
    const endIndex = endTime ? times.indexOf(endTime) : startIndex;
    
    for (const day of targetDays) {
      for (let i = startIndex; i <= endIndex; i++) {
        const time = times[i];
        const isSlotTaken = timeSlots.some(slot => slot.day === day && slot.time === time);
        if (!isSlotTaken) {
          return { day, time };
        }
      }
    }
    return null;
  };

  const isSchedulingCommand = (input: string): boolean => {
    const lowerInput = input.toLowerCase();
    return (
      lowerInput.includes('add') ||
      lowerInput.includes('schedule') ||
      lowerInput.includes('class') ||
      lowerInput.includes('optimize') ||
      lowerInput.includes('clear') ||
      lowerInput.includes('break')
    );
  };

  const handleAddClass = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('optimize') || lowerInput.includes('suggest')) {
      return 'OPTIMIZE_REQUEST';
    }

    if (lowerInput.includes('clear schedule') || lowerInput.includes('reset schedule')) {
      setTimeSlots([]);
      return 'Schedule cleared successfully';
    }

    if (lowerInput.includes('last class everyday')) {
      const subject = input.split(' as ')[0].replace('add ', '');
      const newSlots = days.map(day => ({
        day,
        time: times[times.length - 1],
        subject
      }));
      setTimeSlots(prev => [...prev.filter(slot => slot.time !== times[times.length - 1]), ...newSlots]);
      return `Added ${subject} as the last class every day`;
    }

    if (lowerInput.includes('break')) {
      const timeMatch = input.match(/at\s+(\d{1,2})\s*(am|pm)/i);
      if (timeMatch) {
        const time = `${timeMatch[1]} ${timeMatch[2].toUpperCase()}`;
        if (lowerInput.includes('everyday') || lowerInput.includes('every day')) {
          const newSlots = days.map(day => ({
            day,
            time,
            subject: '⏸ Break'
          }));
          setTimeSlots(prev => [...prev.filter(slot => slot.time !== time), ...newSlots]);
          return `Added break at ${time} every day`;
        }
      }
    }

    if (lowerInput.includes('between')) {
      const timeRangeMatch = input.match(/between\s+(\d{1,2})\s*(am|pm)\s+and\s+(\d{1,2})\s*(am|pm)/i);
      const daysMatch = input.match(/on\s+((?:monday|tuesday|wednesday|thursday|friday)(?:\s+and\s+(?:monday|tuesday|wednesday|thursday|friday))*)/i);
      
      if (timeRangeMatch && daysMatch) {
        const startTime = `${timeRangeMatch[1]} ${timeRangeMatch[2].toUpperCase()}`;
        const endTime = `${timeRangeMatch[3]} ${timeRangeMatch[4].toUpperCase()}`;
        const targetDays = daysMatch[1].split(/\s+and\s+/).map(day => 
          day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()
        );
        
        const subject = input.split(' between ')[0].replace('add a ', '').replace('add ', '');
        
        let addedSlots: TimeSlot[] = [];
        for (const day of targetDays) {
          const availableSlot = findAvailableSlot([day], startTime, endTime);
          if (availableSlot) {
            addedSlots.push({
              day: availableSlot.day,
              time: availableSlot.time,
              subject
            });
          }
        }
        
        if (addedSlots.length > 0) {
          setTimeSlots(prev => [...prev, ...addedSlots]);
          return `Added ${subject} to available slots between ${startTime} and ${endTime} on ${targetDays.join(' and ')}`;
        } else {
          return `No available slots found between ${startTime} and ${endTime} on the specified days`;
        }
      }
    }

    if (lowerInput.includes('first class everyday')) {
      const subject = input.split(' as ')[0].replace('add ', '');
      const newSlots = days.map(day => ({
        day,
        time: times[0],
        subject
      }));
      setTimeSlots(prev => [...prev.filter(slot => slot.time !== times[0]), ...newSlots]);
      return `Added ${subject} as the first class every day`;
    }

    if (lowerInput.includes('every day') && lowerInput.includes(' at ')) {
      const timeMatch = input.match(/at\s+(\d{1,2})\s*(am|pm)/i);
      if (timeMatch) {
        const time = `${timeMatch[1]} ${timeMatch[2].toUpperCase()}`;
        const subject = input.split(' at ')[0].replace('add ', '');
        const newSlots = days.map(day => ({
          day,
          time,
          subject
        }));
        setTimeSlots(prev => [...prev.filter(slot => slot.time !== time), ...newSlots]);
        return `Added ${subject} at ${time} every day`;
      }
    }

    // New ordinal command support:
    // Matches phrases like "as second class on Tuesday" or "as last class on Friday"
    const ordinalMatch = input.match(/as\s+(first|second|third|fourth|fifth|sixth|seventh|eighth|last)\s+class\s+on\s+(monday|tuesday|wednesday|thursday|friday)/i);
    if (ordinalMatch) {
      const ordinal = ordinalMatch[1].toLowerCase();
      const day = ordinalMatch[2].charAt(0).toUpperCase() + ordinalMatch[2].slice(1).toLowerCase();
      const ordinalMapping: { [key: string]: number } = {
        first: 0,
        second: 1,
        third: 2,
        fourth: 3,
        fifth: 4,
        sixth: 5,
        seventh: 6,
        eighth: 7,
      };
      const timeSlot = ordinal === 'last' ? times[times.length - 1] : times[ordinalMapping[ordinal]];
      const subject = input.split(' as ')[0].replace('add ', '').trim();
      setTimeSlots(prev => [
        ...prev.filter(slot => !(slot.day === day && slot.time === timeSlot)),
        { day, time: timeSlot, subject }
      ]);
      return `Added ${subject} as the ${ordinal} class on ${day}`;
    }
    
    // Fallback: generic command matching time and day
    const timeMatch = input.match(/(\d{1,2})\s*(am|pm)/i);
    const dayMatch = input.match(/on\s+(monday|tuesday|wednesday|thursday|friday)/i);
    
    if (timeMatch && dayMatch) {
      const time = `${timeMatch[1]} ${timeMatch[2].toUpperCase()}`;
      const day = dayMatch[1].charAt(0).toUpperCase() + dayMatch[1].slice(1);
      const subject = input.split(' at ')[0].replace('add ', '');
      
      setTimeSlots(prev => [
        ...prev.filter(slot => !(slot.day === day && slot.time === time)),
        { day, time, subject }
      ]);
      return `Added ${subject} at ${time} on ${day}`;
    }
    
    return "I couldn't understand that command. Try:\n- 'add Science at 10 AM on Monday'\n- 'add History as first class everyday'\n- 'add Math as last class everyday'\n- 'add short break at 10 AM everyday'\n- 'add a Geography class between 10 AM and 2 PM on Wednesday and Thursday'\n- 'optimize schedule'\n- 'clear schedule'";
  };

  // Common function to process commands (both text and voice)
  const submitCommand = async (command: string) => {
    setIsLoading(true);
    let response;
    
    if (isSchedulingCommand(command)) {
      response = handleAddClass(command);
      if (response === 'OPTIMIZE_REQUEST') {
        response = await getOptimizationSuggestions(timeSlots);
      }
    } else {
      response = await getGeneralResponse(command);
    }
    
    setChatHistory(prev => {
      const newHistory = [...prev, `You: ${command}`, `AI: ${response}`];
      return newHistory.slice(-6);
    });
    setMessage('');
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitCommand(message);
  };

  // Toggle voice recording on/off
  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setIsRecording(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                EdEase
              </h1>
              <p className="text-gray-600">AI-Powered Timetable for Educators</p>
            </div>
            <button
              onClick={exportTimetable}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={20} />
              Export Timetable
            </button>
          </div>

          <div className="flex gap-8">
            {/* Timetable */}
            <div className="flex-1 bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-6 gap-2">
                <div className="col-span-1"></div>
                {days.map(day => (
                  <div key={day} className="text-center font-semibold text-blue-600">
                    {day}
                  </div>
                ))}
                
                {times.map(time => (
                  <React.Fragment key={time}>
                    <div className="text-right pr-4 text-gray-600">{time}</div>
                    {days.map(day => {
                      const slot = timeSlots.find(s => s.day === day && s.time === time);
                      return (
                        <div
                          key={`${day}-${time}`}
                          className={`border rounded p-2 min-h-[60px] transition-all ${
                            slot 
                              ? slot.subject.includes('Break')
                                ? 'bg-purple-50 border-purple-200'
                                : 'bg-blue-50 border-blue-200'
                              : 'border-gray-200 hover:border-blue-200'
                          }`}
                        >
                          <span className={slot?.subject.includes('Break') ? 'text-purple-600' : 'text-blue-600'}>
                            {slot?.subject}
                          </span>
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Chatbot Interface */}
            <div className="w-96 bg-white rounded-lg shadow-md p-4 flex flex-col h-[600px]">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="text-blue-600" />
                <span className="text-gray-800 font-medium">EdEase Assistant</span>
              </div>
              
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div className="bg-gray-50 rounded-lg p-4">
                  <ReactMarkdown className="prose prose-sm max-w-none">
                    {`Hello! I can help you manage your timetable. Try:

* Add classes at specific times
* Add first/last daily classes
* Schedule breaks
* Add classes in time ranges
* Get schedule optimization`}
                  </ReactMarkdown>
                </div>
                {chatHistory.map((msg, index) => {
                  const isUser = msg.startsWith('You:');
                  const content = msg.slice(4);
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        isUser 
                          ? 'bg-gray-50 ml-8' 
                          : 'bg-gradient-to-r from-blue-50 to-purple-50 mr-8'
                      }`}
                    >
                      <div className="text-sm text-gray-600 mb-1">
                        {isUser ? 'You' : 'EdEase'}
                      </div>
                      <ReactMarkdown className="prose prose-sm max-w-none">
                        {content}
                      </ReactMarkdown>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSubmit} className="mt-auto flex items-center relative">
                <button
                  type="button"
                  onClick={toggleRecording}
                  disabled={isLoading}
                  className="mr-2 focus:outline-none"
                >
                  {isRecording ? (
                    <MicOff size={20} className="text-red-600" />
                  ) : (
                    <Mic size={20} className="text-blue-600" />
                  )}
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-50 rounded-lg py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-purple-600 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <MessageSquare size={20} />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
