 import UnityEngine.UI;
 var qSamples: int = 1024; // array size
 var refValue: float = 0.1; // RMS value for 0 dB
 var threshold = 0.02; // minimum amplitude to extract pitch
 var rmsValue: float; // sound level - RMS
 var dbValue: float; // sound level - dB
 var pitchValue: float; // sound pitch - Hz
 var currentNote = "c0";
 var noteText : GameObject;
 @Header("Notes")
var C0 = 16.35;
var CSharp0ORDb0 = 17.32;
var D0 = 18.35;
var DSharp0OREb0 = 19.45;
var E0 = 20.6;
var F0 = 21.83;
var FSharp0ORGb0 = 23.12;
var G0 = 24.5;
var GSharp0ORAb0 = 25.96;
var A0 = 27.5;
var ASharp0ORBb0 = 29.14;
var B0 = 30.87;
var C1 = 32.7;
var CSharp1ORDb1 = 34.65;
var D1 = 36.71;
var DSharp1OREb1 = 38.89;
var E1 = 41.2;
var F1 = 43.65;
var FSharp1ORGb1 = 46.25;
var G1 = 49;
var GSharp1ORAb1 = 51.91;
var A1 = 55;
var ASharp1ORBb1 = 58.27;
var B1 = 61.74;
var C2 = 65.41;
var CSharp2ORDb2 = 69.3;
var D2 = 73.42;
var DSharp2OREb2 = 77.78;
var E2 = 82.41;
var F2 = 87.31;
var FSharp2ORGb2 = 92.5;
var G2 = 98;
var GSharp2ORAb2 = 103.83;
var A2 = 110;
var ASharp2ORBb2 = 116.54;
var B2 = 123.47;
var C3 = 130.81;
var CSharp3ORDb3 = 138.59;
var D3 = 146.83;
var DSharp3OREb3 = 155.56;
var E3 = 164.81;
var F3 = 174.61;
var FSharp3ORGb3 = 185;
var G3 = 196;
var GSharp3ORAb3 = 207.65;
var A3 = 220;
var ASharp3ORBb3 = 233.08;
var B3 = 246.94;
var C4 = 261.63;
var CSharp4ORDb4 = 277.18;
var D4 = 293.66;
var DSharp4OREb4 = 311.13;
var E4 = 329.63;
var F4 = 349.23;
var FSharp4ORGb4 = 369.99;
var G4 = 392;
var GSharp4ORAb4 = 415.3;
var A4 = 440;
var ASharp4ORBb4 = 466.16;
var B4 = 493.88;
var C5 = 523.25;
var CSharp5ORDb5 = 554.37;
var D5 = 587.33;
var DSharp5OREb5 = 622.25;
var E5 = 659.25;
var F5 = 698.46;
var FSharp5ORGb5 = 739.99;
var G5 = 783.99;
var GSharp5ORAb5 = 830.61;
var A5 = 880;
var ASharp5ORBb5 = 932.33;
var B5 = 987.77;
var C6 = 1046.5;
var CSharp6ORDb6 = 1108.73;
var D6 = 1174.66;
var DSharp6OREb6 = 1244.51;
var E6 = 1318.51;
var F6 = 1396.91;
var FSharp6ORGb6 = 1479.98;
var G6 = 1567.98;
var GSharp6ORAb6 = 1661.22;
var A6 = 1760;
var ASharp6ORBb6 = 1864.66;
var B6 = 1975.53;
var C7 = 2093;
var CSharp7ORDb7 = 2217.46;
var D7 = 2349.32;
var DSharp7OREb7 = 2489.02;
var E7 = 2637.02;
var F7 = 2793.83;
var FSharp7ORGb7 = 2959.96;
var G7 = 3135.96;
var GSharp7ORAb7 = 3322.44;
var A7 = 3520;
var ASharp7ORBb7 = 3729.31;
var B7 = 3951.07;
var C8 = 4186.01;
var CSharp8ORDb8 = 4434.92;
var D8 = 4698.63;
var DSharp8OREb8 = 4978.03;
var E8 = 5274.04;
var F8 = 5587.65;
var FSharp8ORGb8 = 5919.91;
var G8 = 6271.93;
var GSharp8ORAb8 = 6644.88;
var A8 = 7040;
var ASharp8ORBb8 = 7458.62;
var B8 = 7902.13;
 private var samples: float[]; // audio samples
 private var spectrum: float[]; // audio spectrum
 private var fSample: float;

 function Start() {
     samples = new float[qSamples];
     spectrum = new float[qSamples];
     fSample = AudioSettings.outputSampleRate;
 }

 function AnalyzeSound() {
     GetComponent. < AudioSource > ().GetOutputData(samples, 0); // fill array with samples
     var i: int;
     var sum: float = 0;
     for (i = 0; i < qSamples; i++) {
         sum += samples[i] * samples[i]; // sum squared samples
     }
     rmsValue = Mathf.Sqrt(sum / qSamples); // rms = square root of average
     dbValue = 20 * Mathf.Log10(rmsValue / refValue); // calculate dB
     if (dbValue < -160) dbValue = -160; // clamp it to -160dB min
     // get sound spectrum
     GetComponent. < AudioSource > ().GetSpectrumData(spectrum, 0, FFTWindow.BlackmanHarris);
     var maxV: float = 0;
     var maxN: int = 0;
     for (i = 0; i < qSamples; i++) { // find max 
         if (spectrum[i] > maxV && spectrum[i] > threshold) {
             maxV = spectrum[i];
             maxN = i; // maxN is the index of max
         }
     }
     var freqN: float = maxN; // pass the index to a float variable
     if (maxN > 0 && maxN < qSamples - 1) { // interpolate index using neighbours
         var dL = spectrum[maxN - 1] / spectrum[maxN];
         var dR = spectrum[maxN + 1] / spectrum[maxN];
         freqN += 0.5 * (dR * dR - dL * dL);
     }
     pitchValue = freqN * (fSample / 2) / qSamples; // convert index to frequency
 }

 function findNote() {
  if(pitchValue == 0){
	  	currentNote = "~";
  }
  else if (pitchValue - C0 < 2.0 && C0 > -2.0) {
    currentNote = "C0";
} else if (pitchValue - CSharp0ORDb0 < 2.0 && CSharp0ORDb0 > -2.0) {
    currentNote = "CSharp0ORDb0";
} else if (pitchValue - D0 < 2.0 && D0 > -2.0) {
    currentNote = "D0";
} else if (pitchValue - DSharp0OREb0 < 2.0 && DSharp0OREb0 > -2.0) {
    currentNote = "DSharp0OREb0";
} else if (pitchValue - E0 < 2.0 && E0 > -2.0) {
    currentNote = "E0";
} else if (pitchValue - F0 < 2.0 && F0 > -2.0) {
    currentNote = "F0";
} else if (pitchValue - FSharp0ORGb0 < 2.0 && FSharp0ORGb0 > -2.0) {
    currentNote = "FSharp0ORGb0";
} else if (pitchValue - G0 < 2.0 && G0 > -2.0) {
    currentNote = "G0";
} else if (pitchValue - GSharp0ORAb0 < 2.0 && GSharp0ORAb0 > -2.0) {
    currentNote = "GSharp0ORAb0";
} else if (pitchValue - A0 < 2.0 && A0 > -2.0) {
    currentNote = "A0";
} else if (pitchValue - ASharp0ORBb0 < 2.0 && ASharp0ORBb0 > -2.0) {
    currentNote = "ASharp0ORBb0";
} else if (pitchValue - B0 < 2.0 && B0 > -2.0) {
    currentNote = "B0";
} else if (pitchValue - C1 < 2.0 && C1 > -2.0) {
    currentNote = "C1";
} else if (pitchValue - CSharp1ORDb1 < 2.0 && CSharp1ORDb1 > -2.0) {
    currentNote = "CSharp1ORDb1";
} else if (pitchValue - D1 < 2.0 && D1 > -2.0) {
    currentNote = "D1";
} else if (pitchValue - DSharp1OREb1 < 2.0 && DSharp1OREb1 > -2.0) {
    currentNote = "DSharp1OREb1";
} else if (pitchValue - E1 < 2.0 && E1 > -2.0) {
    currentNote = 	"E1";
} else if (pitchValue - F1 < 2.0 && F1 > -2.0) {
    currentNote = "F1";
} else if (pitchValue - FSharp1ORGb1 < 2.0 && FSharp1ORGb1 > -2.0) {
    currentNote = "FSharp1ORGb1";
} else if (pitchValue - G1 < 2.0 && G1 > -2.0) {
    currentNote = "G1";
} else if (pitchValue - GSharp1ORAb1 < 2.0 && GSharp1ORAb1 > -2.0) {
    currentNote = "GSharp1ORAb1";
} else if (pitchValue - A1 < 2.0 && A1 > -2.0) {
    currentNote = "A1";
} else if (pitchValue - ASharp1ORBb1 < 2.0 && ASharp1ORBb1 > -2.0) {
    currentNote = "ASharp1ORBb1";
} else if (pitchValue - B1 < 2.0 && B1 > -2.0) {
    currentNote = "B1";
} else if (pitchValue - C2 < 2.0 && C2 > -2.0) {
    currentNote = "C2";
} else if (pitchValue - CSharp2ORDb2 < 2.0 && CSharp2ORDb2 > -2.0) {
    currentNote = "CSharp2ORDb2";
} else if (pitchValue - D2 < 2.0 && D2 > -2.0) {
    currentNote = "D2";
} else if (pitchValue - DSharp2OREb2 < 2.0 && DSharp2OREb2 > -2.0) {
    currentNote = "DSharp2OREb2";
} else if (pitchValue - E2 < 2.0 && E2 > -2.0) {
    currentNote = "E2";
} else if (pitchValue - F2 < 2.0 && F2 > -2.0) {
    currentNote = "F2";
} else if (pitchValue - FSharp2ORGb2 < 2.0 && FSharp2ORGb2 > -2.0) {
    currentNote = "FSharp2ORGb2";
} else if (pitchValue - G2 < 2.0 && G2 > -2.0) {
    currentNote = "G2";
} else if (pitchValue - GSharp2ORAb2 < 2.0 && GSharp2ORAb2 > -2.0) {
    currentNote = "GSharp2ORAb2";
} else if (pitchValue - A2 < 2.0 && A2 > -2.0) {
    currentNote = "A2";
} else if (pitchValue - ASharp2ORBb2 < 2.0 && ASharp2ORBb2 > -2.0) {
    currentNote = "ASharp2ORBb2";
} else if (pitchValue - B2 < 2.0 && B2 > -2.0) {
    currentNote = "B2";
} else if (pitchValue - C3 < 2.0 && C3 > -2.0) {
    currentNote = "C3";
} else if (pitchValue - CSharp3ORDb3 < 2.0 && CSharp3ORDb3 > -2.0) {
    currentNote = "CSharp3ORDb3";
} else if (pitchValue - D3 < 2.0 && D3 > -2.0) {
    currentNote = "D3";
} else if (pitchValue - DSharp3OREb3 < 2.0 && DSharp3OREb3 > -2.0) {
    currentNote = "DSharp3OREb3";
} else if (pitchValue - E3 < 2.0 && E3 > -2.0) {
    currentNote = "E3";
} else if (pitchValue - F3 < 2.0 && F3 > -2.0) {
    currentNote = "F3";
} else if (pitchValue - FSharp3ORGb3 < 2.0 && FSharp3ORGb3 > -2.0) {
    currentNote = "FSharp3ORGb3";
} else if (pitchValue - G3 < 2.0 && G3 > -2.0) {
    currentNote = "G3";
} else if (pitchValue - GSharp3ORAb3 < 2.0 && GSharp3ORAb3 > -2.0) {
    currentNote = "GSharp3ORAb3";
} else if (pitchValue - A3 < 2.0 && A3 > -2.0) {
    currentNote = "A3";
} else if (pitchValue - ASharp3ORBb3 < 2.0 && ASharp3ORBb3 > -2.0) {
    currentNote = "ASharp3ORBb3";
} else if (pitchValue - B3 < 2.0 && B3 > -2.0) {
    currentNote = "B3";
} else if (pitchValue - C4 < 2.0 && C4 > -2.0) {
    currentNote = "C4";
} else if (pitchValue - CSharp4ORDb4 < 2.0 && CSharp4ORDb4 > -2.0) {
    currentNote = "CSharp4ORDb4";
} else if (pitchValue - D4 < 2.0 && D4 > -2.0) {
    currentNote = "D4";
} else if (pitchValue - DSharp4OREb4 < 2.0 && DSharp4OREb4 > -2.0) {
    currentNote = 	"DSharp4OREb4";
} else if (pitchValue - E4 < 2.0 && E4 > -2.0) {
    currentNote = "E4";
} else if (pitchValue - F4 < 2.0 && F4 > -2.0) {
    currentNote = "F4";
} else if (pitchValue - FSharp4ORGb4 < 2.0 && FSharp4ORGb4 > -2.0) {
    currentNote = "FSharp4ORGb4";
} else if (pitchValue - G4 < 2.0 && G4 > -2.0) {
    currentNote = "G4";
} else if (pitchValue - GSharp4ORAb4 < 2.0 && GSharp4ORAb4 > -2.0) {
    currentNote = "GSharp4ORAb4";
} else if (pitchValue - A4 < 2.0 && A4 > -2.0) {
    currentNote = "A4";
} else if (pitchValue - ASharp4ORBb4 < 2.0 && ASharp4ORBb4 > -2.0) {
    currentNote = "ASharp4ORBb4";
} else if (pitchValue - B4 < 2.0 && B4 > -2.0) {
    currentNote = "B4";
} else if (pitchValue - C5 < 2.0 && C5 > -2.0) {
    currentNote = "C5";
} else if (pitchValue - CSharp5ORDb5 < 2.0 && CSharp5ORDb5 > -2.0) {
    currentNote = "CSharp5ORDb5";
} else if (pitchValue - D5 < 2.0 && D5 > -2.0) {
    currentNote = "D5";
} else if (pitchValue - DSharp5OREb5 < 2.0 && DSharp5OREb5 > -2.0) {
    currentNote = "DSharp5OREb5";
} else if (pitchValue - E5 < 2.0 && E5 > -2.0) {
    currentNote = "E5";
} else if (pitchValue - F5 < 2.0 && F5 > -2.0) {
    currentNote = "F5";
} else if (pitchValue - FSharp5ORGb5 < 2.0 && FSharp5ORGb5 > -2.0) {
    currentNote = "FSharp5ORGb5";
} else if (pitchValue - G5 < 2.0 && G5 > -2.0) {
    currentNote = "G5";
} else if (pitchValue - GSharp5ORAb5 < 2.0 && GSharp5ORAb5 > -2.0) {
    currentNote = "GSharp5ORAb5";
} else if (pitchValue - A5 < 2.0 && A5 > -2.0) {
    currentNote = "A5";
} else if (pitchValue - ASharp5ORBb5 < 2.0 && ASharp5ORBb5 > -2.0) {
    currentNote = "ASharp5ORBb5";
} else if (pitchValue - B5 < 2.0 && B5 > -2.0) {
    currentNote = "B5";
} else if (pitchValue - C6 < 2.0 && C6 > -2.0) {
    currentNote = "C6";
} else if (pitchValue - CSharp6ORDb6 < 2.0 && CSharp6ORDb6 > -2.0) {
    currentNote = "CSharp6ORDb6";
} else if (pitchValue - D6 < 2.0 && D6 > -2.0) {
    currentNote = "	D6	";
} else if (pitchValue - DSharp6OREb6 < 2.0 && DSharp6OREb6 > -2.0) {
    currentNote = "	DSharp6OREb6	";
} else if (pitchValue - E6 < 2.0 && E6 > -2.0) {
    currentNote = 	"E6";
} else if (pitchValue - F6 < 2.0 && F6 > -2.0) {
    currentNote = "F6";
} else if (pitchValue - FSharp6ORGb6 < 2.0 && FSharp6ORGb6 > -2.0) {
    currentNote = "FSharp6ORGb6";
} else if (pitchValue - G6 < 2.0 && G6 > -2.0) {
    currentNote = "G6";
} else if (pitchValue - GSharp6ORAb6 < 2.0 && GSharp6ORAb6 > -2.0) {
    currentNote = "GSharp6ORAb6";
} else if (pitchValue - A6 < 2.0 && A6 > -2.0) {
    currentNote = "A6";
} else if (pitchValue - ASharp6ORBb6 < 2.0 && ASharp6ORBb6 > -2.0) {
    currentNote = "ASharp6ORBb6";
} else if (pitchValue - B6 < 2.0 && B6 > -2.0) {
    currentNote = "B6";
} else if (pitchValue - C7 < 2.0 && C7 > -2.0) {
    currentNote = "C7";
} else if (pitchValue - CSharp7ORDb7 < 2.0 && CSharp7ORDb7 > -2.0) {
    currentNote = "CSharp7ORDb7";
} else if (pitchValue - D7 < 2.0 && D7 > -2.0) {
    currentNote = "D7";
} else if (pitchValue - DSharp7OREb7 < 2.0 && DSharp7OREb7 > -2.0) {
    currentNote = "DSharp7OREb7";
} else if (pitchValue - E7 < 2.0 && E7 > -2.0) {
    currentNote = "E7";
} else if (pitchValue - F7 < 2.0 && F7 > -2.0) {
    currentNote = "F7";
} else if (pitchValue - FSharp7ORGb7 < 2.0 && FSharp7ORGb7 > -2.0) {
    currentNote = "FSharp7ORGb7";
} else if (pitchValue - G7 < 2.0 && G7 > -2.0) {
    currentNote = "	G7";
} else if (pitchValue - GSharp7ORAb7 < 2.0 && GSharp7ORAb7 > -2.0) {
    currentNote = "GSharp7ORAb7";
} else if (pitchValue - A7 < 2.0 && A7 > -2.0) {
    currentNote = "A7";
} else if (pitchValue - ASharp7ORBb7 < 2.0 && ASharp7ORBb7 > -2.0) {
    currentNote = "ASharp7ORBb7";
} else if (pitchValue - B7 < 2.0 && B7 > -2.0) {
    currentNote = "B7";
} else if (pitchValue - C8 < 2.0 && C8 > -2.0) {
    currentNote = "C8";
} else if (pitchValue - CSharp8ORDb8 < 2.0 && CSharp8ORDb8 > -2.0) {
    currentNote = "CSharp8ORDb8	";
} else if (pitchValue - D8 < 2.0 && D8 > -2.0) {
    currentNote = "D8";
} else if (pitchValue - DSharp8OREb8 < 2.0 && DSharp8OREb8 > -2.0) {
    currentNote = "DSharp8OREb8";
} else if (pitchValue - E8 < 2.0 && E8 > -2.0) {
    currentNote = "E8";
} else if (pitchValue - F8 < 2.0 && F8 > -2.0) {
    currentNote = "F8";
} else if (pitchValue - FSharp8ORGb8 < 2.0 && FSharp8ORGb8 > -2.0) {
    currentNote = "FSharp8ORGb8";
} else if (pitchValue - G8 < 2.0 && G8 > -2.0) {
    currentNote = "G8";
} else if (pitchValue - GSharp8ORAb8 < 2.0 && GSharp8ORAb8 > -2.0) {
    currentNote = "GSharp8ORAb8";
} else if (pitchValue - A8 < 2.0 && A8 > -2.0) {
    currentNote = "A8";
} else if (pitchValue - ASharp8ORBb8 < 2.0 && ASharp8ORBb8 > -2.0) {
    currentNote = "ASharp8ORBb8	";
} else if (pitchValue - B8 < 2.0 && B8 > -2.0) {
    currentNote = "B8";
}

 }
 var display: GUIText; // drag a GUIText here to show results

 function Update() {
     if (Input.GetKeyDown("p")) {
         GetComponent. < AudioSource > ().Play();
     }
     AnalyzeSound();
	 findNote();
	 noteText.GetComponent(Text).text = currentNote;
     if (display) {
         display.text = "RMS: " + rmsValue.ToString("F2") +
             " (" + dbValue.ToString("F1") + " dB)\n" +
             "Pitch: " + pitchValue.ToString("F0") + " Hz";
     }
	 
 }