DEFAULT_SCENARIOS = {
    "restaurant": {
        "English": {"desc": "The user is in a restaurant ordering food.", "role": "A waiter"},
        "Chinese": {"desc": "用户正在餐厅点餐。", "role": "服务员"},
        "Japanese": {"desc": "ユーザーはレストランで食べ物を注文しています。", "role": "ウェイター"}
    },
    "job_interview": {
        "English": {"desc": "The user is in a job interview for a software engineering position.", "role": "An interviewer"},
        "Chinese": {"desc": "用户正在面试软件工程师职位。", "role": "面试官"},
        "Japanese": {"desc": "ユーザーはソフトウェアエンジニアの職務面接を受けています。", "role": "面接官"}
    },
    "travel": {
        "English": {"desc": "The user is at an airport checking in for a flight.", "role": "A check-in agent"},
        "Chinese": {"desc": "用户正在机场办理登机手续。", "role": "值机员"},
        "Japanese": {"desc": "ユーザーは空港で搭乗手続きをしています。", "role": "チェックイン係員"}
    }
}

PROFILE_DIR = "user_profiles"
SOUND_RESPONSE_DIR = "sound_responses"

LANGUAGE_MAP = {
    'English': 'en',
    'Chinese': 'zh',
    'Japanese': 'ja'
}