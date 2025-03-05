import sounddevice as sd
import soundfile as sf
from pynput.keyboard import Key, Listener
import speech_recognition as sr
import time
import numpy as np
import tempfile
import queue
import sys

def record_continue():
    #Setup Keyboard
    recording = False
    def on_press(key):
        nonlocal recording
        if key == Key.shift:
            recording = True
        
    
    def on_release(key):
        nonlocal recording
        if key == Key.shift:
        	time.sleep(0.5) #Give some time to finish speaking, otherwise, last word may get cut off
        	recording = False
    listener =Listener(on_press = on_press, on_release = on_release)
    listener.start()

    #Setup Audio
    q = queue.Queue()
    #Variables
    freq = 41400
    channels = 1
    
    def callback(indata, frames, time, status):
        """This is called (from a separate thread) for each audio block."""
        if status:
            print(status, file=sys.stderr)
        q.put(indata.copy())

    print("Hold shift to record. Release to end")
    while not recording:
        time.sleep(0.1)
    print("Recording now!")
    # Make sure the file is opened before recording anything:
    with sf.SoundFile('record.wav', mode='w', samplerate=freq, channels=1) as file: #mode 'w' truncates file
        with sd.InputStream(samplerate=freq, channels=1, callback=callback):
            print('#' * 80)
            print('Release shift to stop the recording')
            print('#' * 80)
            while recording:
                file.write(q.get())
        file.close()

if __name__ == "__main__":
	record_continue()

	# Create an instance of the Recognizer class
	recognizer = sr.Recognizer()

	# Create audio file instance from the original file
	audio_ex = sr.AudioFile('record.wav')
	type(audio_ex)
	# Create audio data
	with audio_ex as source:
	    audiodata = recognizer.record(audio_ex)
	type(audiodata)

	# Extract text
	try:
	    text = recognizer.recognize_google(audio_data=audiodata, language='english')
	except:
	    text = "Whoops! Didn't catch that!"
	#https://cloud.google.com/speech-to-text/docs/speech-to-text-supported-languages
	#Refer to link for languages
	print(text)