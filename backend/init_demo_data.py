"""
Initialize database with demo data for testing
"""
import sys
import uuid
from datetime import datetime, timedelta

from app.core.database import SessionLocal, init_db
from app.core.security import get_password_hash
from app.models.user import User
from app.models.template import Template, TemplateStep, TemplateField
from app.models.ticket import Ticket


def create_demo_users(db):
    """Create demo users"""
    print("Creating demo users...")

    users_data = [
        {
            "id": str(uuid.uuid4()),
            "name": "Demo Engineer",
            "email": "demo@csenergy.com",
            "password": "demo123",
            "role": "engineer"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "John Smith",
            "email": "john@csenergy.com",
            "password": "password123",
            "role": "engineer"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Sarah Johnson",
            "email": "sarah@csenergy.com",
            "password": "password123",
            "role": "supervisor"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Admin User",
            "email": "admin@csenergy.com",
            "password": "admin123",
            "role": "administrator"
        }
    ]

    users = []
    for user_data in users_data:
        user = User(
            id=user_data["id"],
            name=user_data["name"],
            email=user_data["email"],
            hashed_password=get_password_hash(user_data["password"]),
            role=user_data["role"]
        )
        db.add(user)
        users.append(user)

    db.commit()
    print(f"✓ Created {len(users)} demo users")
    return users


def create_demo_templates(db):
    """Create demo templates"""
    print("Creating demo templates...")

    # Template 1: Basic Maintenance Check
    template1 = Template(
        id="TPL001",
        name="基础维护检查 / Basic Maintenance Check",
        description="充电桩常规维护检查 / Regular maintenance check for charging station"
    )
    db.add(template1)
    db.flush()

    # Step 1
    step1 = TemplateStep(
        id="STEP001",
        template_id=template1.id,
        name="外观检查 / Visual Inspection",
        description="检查设备外观状况 / Check device appearance",
        order=1
    )
    db.add(step1)
    db.flush()

    fields = [
        TemplateField(id="FIELD001", step_id=step1.id, name="设备照片 / Device Photo", type="photo", required=True, order=1),
        TemplateField(id="FIELD002", step_id=step1.id, name="备注 / Notes", type="text", required=False, order=2),
    ]
    for field in fields:
        db.add(field)

    # Step 2
    step2 = TemplateStep(
        id="STEP002",
        template_id=template1.id,
        name="功能测试 / Function Test",
        description="测试充电功能 / Test charging functionality",
        order=2
    )
    db.add(step2)
    db.flush()

    fields = [
        TemplateField(id="FIELD003", step_id=step2.id, name="测试电压 / Test Voltage", type="number", required=True, order=1),
        TemplateField(id="FIELD004", step_id=step2.id, name="测试电流 / Test Current", type="number", required=True, order=2),
        TemplateField(id="FIELD005", step_id=step2.id, name="GPS位置 / GPS Location", type="location", required=True, order=3),
    ]
    for field in fields:
        db.add(field)

    # Step 3
    step3 = TemplateStep(
        id="STEP003",
        template_id=template1.id,
        name="完成确认 / Completion Confirmation",
        description="签名确认维护完成 / Sign to confirm completion",
        order=3
    )
    db.add(step3)
    db.flush()

    fields = [
        TemplateField(id="FIELD006", step_id=step3.id, name="工程师签名 / Engineer Signature", type="signature", required=True, order=1),
        TemplateField(id="FIELD007", step_id=step3.id, name="完成日期 / Completion Date", type="date", required=True, order=2),
    ]
    for field in fields:
        db.add(field)

    # Template 2: Emergency Repair
    template2 = Template(
        id="TPL002",
        name="紧急维修 / Emergency Repair",
        description="充电桩故障紧急维修 / Emergency repair for charging station failure"
    )
    db.add(template2)
    db.flush()

    step4 = TemplateStep(
        id="STEP004",
        template_id=template2.id,
        name="故障诊断 / Fault Diagnosis",
        description="诊断故障原因 / Diagnose the fault",
        order=1
    )
    db.add(step4)
    db.flush()

    fields = [
        TemplateField(id="FIELD008", step_id=step4.id, name="故障描述 / Fault Description", type="text", required=True, order=1),
        TemplateField(id="FIELD009", step_id=step4.id, name="故障照片 / Fault Photo", type="photo", required=True, order=2),
        TemplateField(id="FIELD010", step_id=step4.id, name="人脸验证 / Face Verification", type="faceRecognition", required=True, order=3),
    ]
    for field in fields:
        db.add(field)

    db.commit()
    print(f"✓ Created 2 demo templates")
    return [template1, template2]


def create_demo_tickets(db, users, templates):
    """Create demo tickets"""
    print("Creating demo tickets...")

    supervisor = next(u for u in users if u.role == "supervisor")
    engineer = next(u for u in users if u.role == "engineer")

    tickets_data = [
        {
            "id": "T001",
            "title": "Station A - 常规维护 / Regular Maintenance",
            "description": "定期维护检查充电桩A / Regular maintenance check for station A",
            "template_id": templates[0].id,
            "template_name": templates[0].name,
            "status": "assigned",
            "priority": "medium",
            "assigned_to": engineer.id,
            "assigned_to_name": engineer.name,
            "created_by": supervisor.id,
            "created_by_name": supervisor.name,
            "due_date": datetime.utcnow() + timedelta(days=3)
        },
        {
            "id": "T002",
            "title": "Station B - 紧急维修 / Emergency Repair",
            "description": "充电桩B无法充电 / Station B not charging",
            "template_id": templates[1].id,
            "template_name": templates[1].name,
            "status": "new",
            "priority": "urgent",
            "assigned_to": None,
            "assigned_to_name": None,
            "created_by": supervisor.id,
            "created_by_name": supervisor.name,
            "due_date": datetime.utcnow() + timedelta(hours=4)
        },
        {
            "id": "T003",
            "title": "Station C - 外观检查 / Visual Inspection",
            "description": "检查充电桩C外观损坏 / Check station C for physical damage",
            "template_id": templates[0].id,
            "template_name": templates[0].name,
            "status": "inProgress",
            "priority": "low",
            "assigned_to": engineer.id,
            "assigned_to_name": engineer.name,
            "created_by": supervisor.id,
            "created_by_name": supervisor.name,
            "due_date": datetime.utcnow() + timedelta(days=7),
            "accepted": True,
            "accepted_at": datetime.utcnow()
        }
    ]

    for ticket_data in tickets_data:
        ticket = Ticket(**ticket_data)
        db.add(ticket)

    db.commit()
    print(f"✓ Created {len(tickets_data)} demo tickets")


def main():
    """Main function"""
    print("\n" + "="*60)
    print("Initializing Database with Demo Data")
    print("="*60 + "\n")

    # Initialize database
    print("Initializing database tables...")
    init_db()
    print("✓ Database tables created\n")

    # Create session
    db = SessionLocal()

    try:
        # Check if data already exists
        existing_users = db.query(User).count()
        if existing_users > 0:
            print("⚠ Database already contains data!")
            response = input("Do you want to recreate the data? (y/N): ")
            if response.lower() != 'y':
                print("Aborted.")
                return

            # Clear existing data
            print("\nClearing existing data...")
            db.query(Ticket).delete()
            db.query(TemplateField).delete()
            db.query(TemplateStep).delete()
            db.query(Template).delete()
            db.query(User).delete()
            db.commit()
            print("✓ Cleared existing data\n")

        # Create demo data
        users = create_demo_users(db)
        templates = create_demo_templates(db)
        create_demo_tickets(db, users, templates)

        print("\n" + "="*60)
        print("✓ Demo data created successfully!")
        print("="*60)
        print("\nDemo User Accounts:")
        print("-"*60)
        print("Engineer:      demo@csenergy.com / demo123")
        print("Engineer:      john@csenergy.com / password123")
        print("Supervisor:    sarah@csenergy.com / password123")
        print("Administrator: admin@csenergy.com / admin123")
        print("-"*60)
        print("\nYou can now start the server and login with these accounts.")
        print("Run: python run.py")
        print("\n")

    except Exception as e:
        print(f"\n✗ Error: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()
