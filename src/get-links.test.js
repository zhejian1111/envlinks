import getLinks from '../src/get-links';

describe('getLinks', () => {
  let env;

  const withEnv = theEnv => beforeAll(() => { env = theEnv })
  const expectLinks = expectedLinks => () => expect(getLinks(env)).toStrictEqual(expectedLinks)

  const scenario = (description, theEnv, expectation, expectedLinks) => {
    describe(description, () => {
      withEnv(theEnv)

      test(expectation, expectLinks(expectedLinks));
    })
  }

  scenario(
    'with irrelevant variables', {
      LINK: 'blabla',
      NOT_A_LINK_TO_ANYTHING: 'blub',
    },
    'ignores irrelevant env variables', []
  )

  scenario(
    'with all fields present and an index', {
      LINK_12_test_NAME: 'The name',
      LINK_12_test_URL: 'https://example.com',
      LINK_12_test_ICON: 'the-icon',
    },
    'returns the correct link', [
      { name: 'The name', url: 'https://example.com', icon: 'the-icon', index: 12 },
    ]
  )

  scenario(
    'with multiple links with and without index', {
      LINK_2_test1: 'https://example1.com',
      LINK_1_test2: 'https://example2.com',
      LINK_test3: 'https://example3.com',
    },
    'returns the correct links ordered by index', [
      { name: 'test2', url: 'https://example2.com', icon: undefined, index: 1 },
      { name: 'test1', url: 'https://example1.com', icon: undefined, index: 2 },
      { name: 'test3', url: 'https://example3.com', icon: undefined, index: 999999 },
    ]
  )

  describe('name', () => {
    scenario(
      'not given explicitly', {
        LINK_Test_link: 'https://example.com',
      },
      'extracts the name from the key', [
        { name: 'Test link', url: 'https://example.com', icon: undefined, index: 999999 },
      ]
    )

    scenario(
      'given via main spec', {
        LINK_Test_link: 'https://example.com name:Another Name',
      },
      'extracts the name from the main spec', [
        { name: 'Another Name', url: 'https://example.com', icon: undefined, index: 999999 },
      ]
    )

    scenario(
      'given via main spec and _NAME var', {
        LINK_Test_link: 'https://example.com name:the-name',
        LINK_Test_link_NAME: 'Yet another name',
      },
      'uses the name from the _NAME variable', [
        { name: 'Yet another name', url: 'https://example.com name:the-name', icon: undefined, index: 999999 },
      ]
    )
  })

  describe('icon', () => {
    scenario(
      'given via main spec', {
        LINK_test: 'https://example.com icon:the-icon',
      },
      'extracts the icon from the main spec', [
        { name: 'test', url: 'https://example.com', icon: 'the-icon', index: 999999 },
      ]
    )

    scenario(
      'given via main spec and _ICON var', {
        LINK_test: 'https://example.com icon:the-icon',
        LINK_test_ICON: 'other-icon',
      },
      'uses the icon from the _ICON variable', [
        { name: 'test', url: 'https://example.com icon:the-icon', icon: 'other-icon', index: 999999 },
      ]
    )
  })

  describe('URL', () => {
    scenario(
      'with the URL given via main spec', {
        LINK_test: 'https://example.com',
      },
      'extracts the URL from the main spec', [
        { name: 'test', url: 'https://example.com', icon: undefined, index: 999999 },
      ]
    )

    scenario(
      'with the URL given via main spec and _URL var', {
        LINK_test: 'https://example.com',
        LINK_test_URL: 'https://another.url',
      },
      'uses the url from the _URL variable', [
        { name: 'test', url: 'https://another.url', icon: undefined, index: 999999 },
      ]
    )
  })
})