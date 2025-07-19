-------------------------------------
Translated Report (Full Report Below)
-------------------------------------

Process:               App Store [544]
Path:                  /System/Applications/App Store.app/Contents/MacOS/App Store
Identifier:            com.apple.AppStore
Version:               3.0 (1010.5.4)
Build Info:            AppStoreJet-10005004000000~455
Code Type:             ARM-64 (Native)
Parent Process:        launchd [1]
User ID:               504

Date/Time:             2025-07-19 11:58:32.1943 +1000
OS Version:            macOS 15.5 (24F74)
Report Version:        12
Anonymous UUID:        9C960C3A-4374-52BE-CFF4-CD032F42B4DB

Sleep/Wake UUID:       9968BDEF-146B-4BF1-9791-3291ED733557

Time Awake Since Boot: 110000 seconds
Time Since Wake:       610 seconds

System Integrity Protection: enabled

Crashed Thread:        9  Dispatch queue: AppStoreKit.ASKRestrictions.queue

Exception Type:        EXC_BAD_ACCESS (SIGSEGV)
Exception Codes:       KERN_INVALID_ADDRESS at 0x000017348128a700
Exception Codes:       0x0000000000000001, 0x000017348128a700

Termination Reason:    Namespace SIGNAL, Code 11 Segmentation fault: 11
Terminating Process:   exc handler [544]

VM Region Info: 0x17348128a700 is not in any region.  Bytes after previous region: 25033236326145  Bytes before following region: 80038843603200
      REGION TYPE                    START - END         [ VSIZE] PRT/MAX SHRMOD  REGION DETAIL
      commpage (reserved)        1000000000-7000000000   [384.0G] ---/--- SM=NUL  reserved VM address space (unallocated)
--->  GAP OF 0x5f9000000000 BYTES
      MALLOC_NANO              600000000000-600020000000 [512.0M] rw-/rwx SM=PRV  
