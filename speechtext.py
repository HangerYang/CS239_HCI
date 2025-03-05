import sounddevice as sd
from scipy.io.wavfile import write
import wavio as wv

#Language dict
langdict = {'afrikaans': 'af', 'albanian': 'sq', 'amharic': 'am', 'arabic': 'ar', 'armenian': 'hy',
 'assamese': 'as', 'aymara': 'ay', 'azerbaijani': 'az', 'bambara': 'bm', 'basque': 'eu', 'belarusian': 'be',
  'bengali': 'bn', 'bhojpuri': 'bho', 'bosnian': 'bs', 'bulgarian': 'bg', 'catalan': 'ca', 'cebuano': 'ceb', 'chichewa': 'ny', 'chinese (simplified)': 'zh-CN', 'chinese (traditional)': 'zh-TW', 'corsican': 'co',
  'croatian': 'hr', 'czech': 'cs', 'danish': 'da', 'dhivehi': 'dv', 'dogri': 'doi', 'dutch': 'nl', 'english': 'en',
  'esperanto': 'eo', 'estonian': 'et', 'ewe': 'ee', 'filipino': 'tl', 'finnish': 'fi', 'french': 'fr',
  'frisian': 'fy', 'galician': 'gl', 'georgian': 'ka', 'german': 'de', 'greek': 'el', 'guarani': 'gn',
  'gujarati': 'gu', 'haitian creole': 'ht', 'hausa': 'ha', 'hawaiian': 'haw', 'hebrew': 'iw', 'hindi': 'hi',
  'hmong': 'hmn', 'hungarian': 'hu', 'icelandic': 'is', 'igbo': 'ig', 'ilocano': 'ilo', 'indonesian': 'id',
  'irish': 'ga', 'italian': 'it', 'japanese': 'ja', 'javanese': 'jw', 'kannada': 'kn', 'kazakh': 'kk',
  'khmer': 'km', 'kinyarwanda': 'rw', 'konkani': 'gom', 'korean': 'ko', 'krio': 'kri', 'kurdish (kurmanji)': 'ku',
  'kurdish (sorani)': 'ckb', 'kyrgyz': 'ky', 'lao': 'lo', 'latin': 'la', 'latvian': 'lv', 'lingala': 'ln',
  'lithuanian': 'lt', 'luganda': 'lg', 'luxembourgish': 'lb', 'macedonian': 'mk', 'maithili': 'mai',
  'malagasy': 'mg', 'malay': 'ms', 'malayalam': 'ml', 'maltese': 'mt', 'maori': 'mi', 'marathi': 'mr',
  'meiteilon (manipuri)': 'mni-Mtei', 'mizo': 'lus', 'mongolian': 'mn', 'myanmar': 'my', 'nepali': 'ne',
  'norwegian': 'no', 'odia (oriya)': 'or', 'oromo': 'om', 'pashto': 'ps', 'persian': 'fa', 'polish': 'pl',
  'portuguese': 'pt', 'punjabi': 'pa', 'quechua': 'qu', 'romanian': 'ro', 'russian': 'ru', 'samoan': 'sm',
  'sanskrit': 'sa', 'scots gaelic': 'gd', 'sepedi': 'nso', 'serbian': 'sr', 'sesotho': 'st', 'shona': 'sn',
  'sindhi': 'sd', 'sinhala': 'si', 'slovak': 'sk', 'slovenian': 'sl', 'somali': 'so', 'spanish': 'es',
  'sundanese': 'su', 'swahili': 'sw', 'swedish': 'sv', 'tajik': 'tg', 'tamil': 'ta', 'tatar': 'tt', 'telugu': 'te',
  'thai': 'th', 'tigrinya': 'ti', 'tsonga': 'ts', 'turkish': 'tr', 'turkmen': 'tk', 'twi': 'ak', 'ukrainian': 'uk',
  'urdu': 'ur', 'uyghur': 'ug', 'uzbek': 'uz', 'vietnamese': 'vi', 'welsh': 'cy', 'xhosa': 'xh', 'yiddish': 'yi',
  'yoruba': 'yo', 'zulu': 'zu'}

# Sample frequency
freq = 41400 #Change to 48000 if this doesn't work. Kind of weird.
# Recording duration
duration = 5
 
# Start recorder with the given values 
# of duration and sample frequency
print("List of available languages" + str(list(langdict.keys())))
original_lang = input("Type up source language ('french', 'english', etc.): ")
translate_lang = input("Type up language to translate into('french', 'english', etc.): ")
original_lang = langdict[original_lang]
translate_lang = langdict[translate_lang]

input("Press Enter and start speaking (Duration is 5 seconds):")
recording = sd.rec(int(duration * freq), samplerate=freq, channels=1)
# Record audio for the given number of seconds
sd.wait()
 
# This will convert the NumPy array to an audio
# file with the given sampling frequency
write("recording0.wav", freq, recording)

# Convert the NumPy array to audio file 
wv.write("recording1.wav", recording, freq, sampwidth=2) #USE THIS: THIS IS THE FORMAT THAT ALLOWS FOR  AUDIO FILE PROCESSING

import speech_recognition as sr
# Create an instance of the Recognizer class
recognizer = sr.Recognizer()

# Create audio file instance from the original file
audio_ex = sr.AudioFile('recording1.wav')
type(audio_ex)
# Create audio data
with audio_ex as source:
    audiodata = recognizer.record(audio_ex)
type(audiodata)


# Extract text
text = recognizer.recognize_google(audio_data=audiodata, language=original_lang)
#https://cloud.google.com/speech-to-text/docs/speech-to-text-supported-languages
#Refer to link for languages


from deep_translator import GoogleTranslator
translated = GoogleTranslator(source=original_lang, target=translate_lang).translate(text)
print("Original to Target Translation:")
print(translated)


print("Translation from Original to Chinese")
translated = GoogleTranslator(source=original_lang, target='zh-CN').translate(text)
print(translated)