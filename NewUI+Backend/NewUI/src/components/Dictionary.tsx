"use client";
import { GoogleGenerativeAI } from '@google/generative-ai';
import React, { useState } from 'react';

const Dictionary = () => {
  const [word, setWord] = useState('');
  const [result, setResult] = useState<{ word: string; definition: string; example: string }>({
    word: '',
    definition: '',
    example: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDefinition = async (searchWord: string) => {
    setLoading(true);
    setError('');
    setResult({ word: '', definition: '', example: '' });

    try {
      const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
      const genAI = new GoogleGenerativeAI(API_KEY);
      const systemInstruction = "You will be given a word or phrase. Act as a dictionary and provide a defintion of that word or phrase in English. Then, provide an example usage of that word or phrase.Separate out sections using \"//\" so that a user can use Javascript string parsing to nicely format your text output. IMPORTANT:  Do not provide the labels for the sections. For example, provide the definition in plain text, without the word \"Definition:\" in front. Do not bold the word or phrase. A caveat for non English words - If the word or phrase searched is not English, provide an example in the word's language and then translate it to English. ";
      const model = await genAI.getGenerativeModel({ model: 'gemini-2.0-pro-exp-02-05', systemInstruction });

      const response = await model.generateContent(searchWord);

      if (response && response.response) {
        const generatedText = response.response.text();
        const sections = generatedText.split('//');
        const wordMatch = sections[0]?.trim() || searchWord;
        const definitionMatch = sections[1]?.replace('Definition:', '').trim() || 'No definition found.';

        setResult({
          word: searchWord,
          definition: wordMatch,
          example: definitionMatch,
        });
      } else {
        throw new Error('No response received from the model.');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (word.trim()) {
      fetchDefinition(word.trim());
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto mb-3">
        {loading ? (
          <p className="text-gray-500">Looking up "{word}"...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : result.word ? (
          <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-2 text-black">{result.word}</h2>
            <div className="mb-2">
              <h3 className="text-md font-semibold text-[#48d1cc]">Definition:</h3>
              <p className="text-gray-800 text-sm">{result.definition}</p>
            </div>
            <div>
              <h3 className="text-md font-semibold text-[#48d1cc]">Example Usage:</h3>
              <p className="text-gray-800 italic text-sm">{result.example}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-center">Search for a word to get its definition.</p>
        )}
      </div>

      <form onSubmit={handleSearch} className="flex">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Enter a word..."
          className="flex-grow p-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#48d1cc] text-black text-sm"
        />
        <button
          type="submit"
          className="bg-[#48d1cc] text-white px-4 py-2 rounded-r-lg hover:bg-[#008080] transition-all text-sm"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default Dictionary;
