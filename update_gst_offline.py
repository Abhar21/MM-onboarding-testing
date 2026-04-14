import re

def update_file(filename):
    with open(filename, 'r') as f:
        content = f.read()

    # Replacing UI text cases
    content = content.replace("platform and offline earnings", "platform and Paid at Event earnings")
    content = content.replace("platform + offline earnings", "platform + Paid at Event earnings")
    content = content.replace(">Offline:<", ">Paid at Event:<")
    content = content.replace("Offline:", "Paid at Event:")
    content = content.replace("Offline data self-reported", "Paid at Event data self-reported")
    content = content.replace("Offline GST", "Paid at Event GST")
    content = content.replace("Offline earnings are self-reported", "Paid at Event earnings are self-reported")
    content = content.replace("} offline", "} Paid at Event", 20) # for {formatCurrency(row.offline)} offline
    content = content.replace("offline</span>", "Paid at Event</span>")
    
    # Handle the specific case in MobileDashboard:
    content = content.replace("platform + ₹1,50,000 offline", "platform + ₹1,50,000 Paid at Event")
    content = content.replace("platform + ₹1,80,000 offline", "platform + ₹1,80,000 Paid at Event")
    content = content.replace("platform + ₹1,65,000 offline", "platform + ₹1,65,000 Paid at Event")
    content = content.replace("platform + ₹4,95,000 offline", "platform + ₹4,95,000 Paid at Event")

    with open(filename, 'w') as f:
        f.write(content)

update_file("src/GSTCompliance.tsx")
update_file("src/MobileDashboard.tsx")
update_file("src/App.tsx")
