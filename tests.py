import unittest

if __name__ == "__main__":
    # Load all tests from the 'tests' package
    suite = unittest.defaultTestLoader.discover('tests')
    # Run the tests
    unittest.TextTestRunner().run(suite)