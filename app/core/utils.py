from jdatetime import datetime as jdatetime 

def shamsi_date(date):
        shamsi_date = jdatetime.fromgregorian(datetime=date)
        return shamsi_date.strftime("%Y/%m/%d")