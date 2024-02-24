export const fetchSome = async (url, rejectWithValue, options = null) => {
  try {
    const response = options ? await fetch(url, options) : await fetch(url);

    if (response.status === 422) {
      const res = await response.json();
      return rejectWithValue(res);
    }

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    if (response.status === 204) {
      return response.status;
    }
    const result = await response.json();
    return result;
  } catch (error) {
    return rejectWithValue(error.message);
  }
};
