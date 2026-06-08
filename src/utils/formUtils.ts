export const validateImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      reject(new Error('Допустимые форматы: JPEG, PNG'));
      return;
    }
    if (file.size > maxSize) {
      reject(new Error('Размер файла не должен превышать 5MB'));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string); // base64
    };
    reader.onerror = () => {
      reject(new Error('Ошибка чтения файла'));
    };
    reader.readAsDataURL(file);
  });
};

export const checkPasswordStrength = (password: string) => {
  const criteria = {
    hasNumber: /[0-9]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  const score = Object.values(criteria).filter(Boolean).length;
  return { score, criteria };
};

export const getStrengthText = (score: number): string => {
  if (score === 0) return 'Очень слабый';
  if (score === 1) return 'Слабый';
  if (score === 2) return 'Средний';
  if (score === 3) return 'Хороший';
  return 'Отличный';
};