export default {
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.[tj]sx?$": "babel-jest",
    },
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
      "\\.(gif|ttf|eot|svg|png|jpg|jpeg)$": "<rootDir>/__mocks__/fileMock.js",
    },
  };
  