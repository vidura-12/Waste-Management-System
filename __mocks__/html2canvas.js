const html2canvas = jest.fn().mockResolvedValue({
    toDataURL: jest.fn().mockReturnValue('data:image/png;base64,mock'),
  });
  
  export default html2canvas;