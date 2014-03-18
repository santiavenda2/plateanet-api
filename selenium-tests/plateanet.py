from selenium import webdriver
import selenium.webdriver.support.ui as ui
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException, NoAlertPresentException
import unittest


def print_promotions(promotions):
    for promotion in promotions[1:]:
        #promotion = driver.find_element_by_xpath("//table[@id='tabla_promo']/tbody/tr[3]")
        promotion_name = promotion.find_element_by_xpath("td[1]").text
        promotion_disponibilidad = promotion.find_element_by_xpath("td[2]").text
        print promotion_name, promotion_disponibilidad


class Plateanet(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        self.base_url = "http://www.plateanet.com"
        self.verificationErrors = []
        self.accept_next_alert = True


    def test_plateanet(self):
        driver = self.driver
        driver.get(self.base_url)
        driver.find_element_by_id("Obras").click()
        select = Select(driver.find_element_by_id("Obras"))
        select.select_by_visible_text("WAINRAICH Y LOS FRUSTRADOS")
        driver.find_element_by_css_selector("div.imgComprarInt > a").click()
        driver.find_element_by_id("IdentityCustomer").send_keys("santiavenda2@gmail.com")
        driver.find_element_by_id("clave").send_keys("plateanet")
        driver.find_element_by_name("Ingresar").click()
        driver.find_element_by_css_selector("div.comprasLogContinuar > a").click()
        driver.find_element_by_id("drop1_arrow").click()
        # select fecha 2
        driver.find_element_by_id("drop1_msa_2").click()
        driver.find_element_by_id("sec_arr").click()
        first_sector = driver.find_element_by_xpath("//table[@id='tabla_sector']/tbody/tr[2]")
        print first_sector.text
        first_sector.find_element_by_xpath("td[2]").click()
        #driver.find_element_by_xpath("//table[@id='tabla_sector']/tbody/tr[2]/td[2]").click()
        driver.find_element_by_id("prom_arr").click()
        promotions = driver.find_elements_by_xpath("//table[@id='tabla_promo']/tbody/tr")
        print_promotions(promotions)
    
    def is_element_present(self, how, what):
        try:
            self.driver.find_element(by=how, value=what)
        except NoSuchElementException, e:
            return False
        return True
    
    def is_alert_present(self):
        try:
            self.driver.switch_to_alert()
        except NoAlertPresentException, e:
            return False
        return True
    
    def close_alert_and_get_its_text(self):
        try:
            alert = self.driver.switch_to_alert()
            alert_text = alert.text
            if self.accept_next_alert:
                alert.accept()
            else:
                alert.dismiss()
            return alert_text
        finally: self.accept_next_alert = True
    
    def tearDown(self):
        self.driver.quit()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
