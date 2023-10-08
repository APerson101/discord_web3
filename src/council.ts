import axios from "axios";

class CouncilMethods {
  static async fetchSummary(messages: string) {
    const response = await axios.post('http://127.0.0.1:8000/summarize', {conversation: messages})
    return response.data;

  }
}

export {CouncilMethods};
