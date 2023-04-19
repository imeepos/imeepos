from selenium import webdriver
from selenium.webdriver.common.by import By

browser = webdriver.Chrome()
browser.get("https://baidu.com")
page = browser.print_page()
# print(page)
search_box = browser.find_element(by=By.ID, value="kw")
search_box.send_keys("Python")
search_button = browser.find_element(by=By.ID, value="su")
search_button.click()
results = browser.find_elements(by=By.CLASS_NAME, value="EC_result")
print(results)
browser.quit()
