const jsPDF = jest.fn().mockImplementation(() => ({
    text: jest.fn(),
    html: jest.fn().mockResolvedValue({}),
    save: jest.fn(),
    output: jest.fn().mockReturnValue('mock-pdf-data'),
    setFont: jest.fn(),
    setFontSize: jest.fn(),
    setTextColor: jest.fn(),
    addImage: jest.fn(),
  }));
  
  export default jsPDF;