#define FR_HOUR_ND 108000L    // frames per hour in non-drop mode
#define FR_HOUR_DROP 107892L  // frames per hour in drop frame mode
#define FR_TENMIN_DROP 17982L // frames per ten minutes in drop frame
#define FR_MINUTE_DROP 1798L  // frame per minute in drop frame mode
#define FR_MINUTE_ND 1800L    // frames per minute in non-drop mode
#define FR_SECOND 30L         // frames per second, both modes NTSC

#define FR_HOUR_PAL 90000L  // frames per hour in PAL
#define FR_MINUTE_PAL 1500L // frames per minute in PAL
#define FR_SECOND_PAL 25L   // frames per second in PAL
// #include <emscripten.h>
#define DWORD unsigned int
#define BOOL int
#define TRUE 1
#define FALSE 0
#include <stdio.h>
enum VIDEO_TYPE
{
    VIDEO_25,
    VIDEO_SECAM,
    VIDEO_30,
    VIDEO_30M,
    VIDEO_50,
    VIDEO_60,
    VIDEO_60M
};
double TP_GetVideoFps(VIDEO_TYPE eVideo)
{
    switch (eVideo)
    {
    case VIDEO_25:
        return 25;
    case VIDEO_SECAM:
        return 25;
    case VIDEO_30:
        return 30;
    case VIDEO_30M:
        return 29.97;
    case VIDEO_50:
        return 50;
    case VIDEO_60:
        return 60;
    case VIDEO_60M:
        return 59.94;
    default:
        return 29.97;
    }
}
int TP_IsDropFrame(VIDEO_TYPE eType)
{
    return eType == VIDEO_30M || eType == VIDEO_60M;
}

void TP_GetTimeFormFrame(DWORD Frame, int &nH, int &nM, int &nS, int &nF, VIDEO_TYPE eVtrFormat)
{
    DWORD dwReste, hour, minute;
    switch (eVtrFormat)
    {
    case VIDEO_30M:
        hour = (Frame / FR_HOUR_DROP);
        dwReste = (Frame % FR_HOUR_DROP);
        minute = 10 * (dwReste / FR_TENMIN_DROP);
        dwReste = (dwReste % FR_TENMIN_DROP);
        if (dwReste >= FR_MINUTE_ND)
        {
            dwReste -= FR_MINUTE_ND;
            minute += 1 + (dwReste / FR_MINUTE_DROP);
            dwReste %= FR_MINUTE_DROP;
            dwReste += 2;
        }
        nH = hour;
        nM = minute;
        nS = (dwReste / FR_SECOND);
        nF = (dwReste % FR_SECOND);
        break;
    case VIDEO_30:
        hour = (Frame / FR_HOUR_ND);
        dwReste = (Frame % FR_HOUR_ND);
        minute = (dwReste / FR_MINUTE_ND);
        dwReste = (dwReste % FR_MINUTE_ND);
        nH = hour;
        nM = minute;
        nS = (dwReste / FR_SECOND);
        nF = (dwReste % FR_SECOND);
        break;
    default:
    case VIDEO_25:
    case VIDEO_SECAM:
        hour = (Frame / FR_HOUR_PAL);
        dwReste = (Frame % FR_HOUR_PAL);
        minute = (dwReste / FR_MINUTE_PAL);
        dwReste = (dwReste % FR_MINUTE_PAL);
        nH = hour;
        nM = minute;
        nS = (dwReste / FR_SECOND_PAL);
        nF = (dwReste % FR_SECOND_PAL);
        break;
    case VIDEO_50:
    {
        hour = (Frame / 180000);
        dwReste = (Frame % 180000);
        minute = (dwReste / 3000);
        dwReste = (dwReste % 3000);
        nH = hour;
        nM = minute;
        nS = (dwReste / 50);
        nF = (dwReste % 50);
    }
    break;
    case VIDEO_60M:
    {
        hour = (Frame / (FR_HOUR_DROP << 1));
        dwReste = (Frame % (FR_HOUR_DROP << 1));
        minute = 10 * (dwReste / (FR_TENMIN_DROP << 1));
        dwReste = (dwReste % (FR_TENMIN_DROP << 1));
        if (dwReste >= (FR_MINUTE_ND << 1))
        {
            dwReste -= (FR_MINUTE_ND << 1);
            minute += 1 + (dwReste / (FR_MINUTE_DROP << 1));
            dwReste %= (FR_MINUTE_DROP << 1);
            dwReste += 4;
        }
        nH = hour;
        nM = minute;
        nS = (dwReste / (FR_SECOND << 1));
        nF = (dwReste % (FR_SECOND << 1));
    }
    break;
    case VIDEO_60:
    {
        hour = (Frame / 216000);
        dwReste = (Frame % 216000);
        minute = (dwReste / 3600);
        dwReste = (dwReste % 3600);
        nH = hour;
        nM = minute;
        nS = (dwReste / 60);
        nF = (dwReste % 60);
    }
    break;
    }
    nH %= 24;
}

DWORD TP_GetFrameFormTime(int nH, int nM, int nS, int nF, DWORD eVtrFormat)
{
    VIDEO_TYPE eVideoType = (VIDEO_TYPE)eVtrFormat;
    BOOL bDoubelFPS = (eVideoType == VIDEO_60M || eVideoType == VIDEO_50 || eVideoType == VIDEO_60) ? TRUE : FALSE;
    // if (bDoubelFPS && !g_bTCMode)
    // {
    //     return GetFrameFormTimeOfHalfStep(nH, nM, nS, nF, eVtrFormat);
    // }

    switch (eVtrFormat)
    {
    case VIDEO_30M:
        if ((nM % 10) != 0)
        {
            if (nS == 0 && (nF == 0 || nF == 1))
                nF = 2;
        }
        return nH * FR_HOUR_DROP + (nM / 10) * FR_TENMIN_DROP + (nM % 10) * FR_MINUTE_DROP + nS * FR_SECOND + nF;
    case VIDEO_30:
        return nH * FR_HOUR_ND + nM * FR_MINUTE_ND + nS * FR_SECOND + nF;
    case VIDEO_25:
    case VIDEO_SECAM:
        return nH * FR_HOUR_PAL + nM * FR_MINUTE_PAL + nS * FR_SECOND_PAL + nF;
    case VIDEO_50:
        return nH * 180000 + nM * 3000 + nS * 50 + nF;
    case VIDEO_60:
        return nH * 216000 + nM * 3600 + nS * 60 + nF;
    case VIDEO_60M: //MARK 2015/05/26
        if ((nM % 10) != 0)
        {
            if (nS == 0 && (0 <= nF && nF <= 3))
                nF = 4;
        }
        return nH * (FR_HOUR_DROP << 1) + (nM / 10) * (FR_TENMIN_DROP << 1) + (nM % 10) * (FR_MINUTE_DROP << 1) + nS * (FR_SECOND << 1) + nF;
    }
    return 0;
}

int main(int argc, char **argv)
{
    int nH = 0;
    int nW = 3;
    int nS = 0;
    int nF = 0;
    int frame = TP_GetFrameFormTime(nH, nW, nS, nF, VIDEO_30M);
    printf("nH: %d nW: %d nS: %d nF: %d\n", nH, nW, nS, nF);
    printf("frame: %d\n", frame);
    return 0;
}