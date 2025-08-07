document.addEventListener('DOMContentLoaded', () => {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarMenu = document.querySelector('.navbar-menu');

    if (navbarToggler) {
        navbarToggler.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
        });
    }

    // Language toggle functionality
    const langEn = document.getElementById('lang-en');
    const langHi = document.getElementById('lang-hi');

    const setLanguage = (lang) => {
        localStorage.setItem('language', lang);
        updateContent(lang);
    };

    const updateContent = (lang) => {
        const langData = languages[lang];
        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            if (langData[key]) {
                element.textContent = langData[key];
            }
        });

        if (lang === 'hi') {
            document.documentElement.lang = 'hi';
            langHi.classList.add('active');
            langEn.classList.remove('active');
        } else {
            document.documentElement.lang = 'en';
            langEn.classList.add('active');
            langHi.classList.remove('active');
        }
    };

    if (langEn && langHi) {
        langEn.addEventListener('click', () => setLanguage('en'));
        langHi.addEventListener('click', () => setLanguage('hi'));

        // Set initial language
        const initialLang = localStorage.getItem('language') || 'en';
        updateContent(initialLang);
    }

    // Theme toggle functionality
    const themeLight = document.getElementById('theme-light');
    const themeDark = document.getElementById('theme-dark');

    const setTheme = (theme) => {
        localStorage.setItem('theme', theme);
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            themeDark.classList.add('active');
            themeLight.classList.remove('active');
        } else {
            document.body.classList.remove('dark-theme');
            themeLight.classList.add('active');
            themeDark.classList.remove('active');
        }
    };

    if (themeLight && themeDark) {
        themeLight.addEventListener('click', () => setTheme('light'));
        themeDark.addEventListener('click', () => setTheme('dark'));

        // Set initial theme
        const initialTheme = localStorage.getItem('theme') || 'light';
        setTheme(initialTheme);
    }

    // Validation Utility Functions
    const showError = (input, message) => {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('is-valid');
        formGroup.classList.add('is-invalid');
        let error = formGroup.querySelector('.error-message');
        if (!error) {
            error = document.createElement('div');
            error.classList.add('error-message');
            formGroup.appendChild(error);
        }
        error.textContent = message;
    };

    const clearError = (input) => {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('is-invalid');
        formGroup.classList.add('is-valid');
        const error = formGroup.querySelector('.error-message');
        if (error) {
            error.remove();
        }
    };

    const isValidEmail = (email) => {
        const re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((\[[0-2]{3}\.[0-2]{3}\.[0-2]{3}\.[0-2]{3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const isValidPhone = (phone) => {
        const re = /^\+?[0-9]{10,14}$/;
        return re.test(String(phone));
    };

    const validateField = (input) => {
        if (input.type === 'text' || input.type === 'email' || input.type === 'tel' || input.type === 'number' || input.tagName === 'SELECT') {
            if (input.hasAttribute('required') && input.value.trim() === '') {
                showError(input, 'This field is required');
                return false;
            }
            if (input.type === 'email' && !isValidEmail(input.value.trim())) {
                showError(input, 'Invalid email address');
                return false;
            }
            if (input.type === 'tel' && !isValidPhone(input.value.trim())) {
                showError(input, 'Invalid phone number (e.g., +911234567890)');
                return false;
            }
        }
        clearError(input);
        return true;
    };

    // Animated impact statistics
    const counters = document.querySelectorAll('.count');
    const speed = 200; // The lower the slower

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;

                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target;
                }
            };

            updateCount();
        });
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const impactSection = document.getElementById('impact');
    if (impactSection) {
        observer.observe(impactSection);
    }

    // Donation Page
    const donationForm = document.getElementById('donation-form');
    if (donationForm) {
        const amountButtons = document.querySelectorAll('.btn-amount');
        const customAmountInput = document.getElementById('custom-amount');
        const impactMessage = document.getElementById('impact-message');
        const donorNameInput = document.getElementById('donor-name');
        const donorEmailInput = document.getElementById('donor-email');
        const donorPhoneInput = document.getElementById('donor-phone');

        const saveDonationDraft = () => {
            const draft = {
                amount: customAmountInput.value,
                name: donorNameInput.value,
                email: donorEmailInput.value,
                phone: donorPhoneInput.value,
            };
            localStorage.setItem('donationFormDraft', JSON.stringify(draft));
        };

        const loadDonationDraft = () => {
            const draft = JSON.parse(localStorage.getItem('donationFormDraft'));
            if (draft) {
                customAmountInput.value = draft.amount || '';
                donorNameInput.value = draft.name || '';
                donorEmailInput.value = draft.email || '';
                donorPhoneInput.value = draft.phone || '';
                if (draft.amount) {
                    updateImpactMessage(draft.amount);
                }
            }
        };

        const validateDonationForm = () => {
            let isValid = true;
            isValid = validateField(donorNameInput) && isValid;
            isValid = validateField(donorEmailInput) && isValid;
            isValid = validateField(donorPhoneInput) && isValid;

            // Validate amount selection
            const selectedAmount = document.querySelector('.btn-amount.active');
            if (!selectedAmount && !customAmountInput.value) {
                showError(customAmountInput, 'Please select an amount or enter a custom amount');
                isValid = false;
            } else if (customAmountInput.value && parseFloat(customAmountInput.value) <= 0) {
                showError(customAmountInput, 'Amount must be positive');
                isValid = false;
            } else {
                clearError(customAmountInput);
            }
            return isValid;
        };

        amountButtons.forEach(button => {
            button.addEventListener('click', () => {
                amountButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                customAmountInput.value = '';
                clearError(customAmountInput); // Clear error when a preset amount is selected
                updateImpactMessage(button.dataset.amount);
                saveDonationDraft();
            });
        });

        customAmountInput.addEventListener('input', () => {
            amountButtons.forEach(btn => btn.classList.remove('active'));
            validateField(customAmountInput);
            updateImpactMessage(customAmountInput.value);
            saveDonationDraft();
        });

        donorNameInput.addEventListener('input', () => { validateField(donorNameInput); saveDonationDraft(); });
        donorEmailInput.addEventListener('input', () => { validateField(donorEmailInput); saveDonationDraft(); });
        donorPhoneInput.addEventListener('input', () => { validateField(donorPhoneInput); saveDonationDraft(); });

        donationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!validateDonationForm()) {
                showToast(languages[document.documentElement.lang].pleaseCorrectErrors, 'error');
                return;
            }

            const amount = parseFloat(customAmountInput.value || document.querySelector('.btn-amount.active').dataset.amount);
            const donorName = donorNameInput.value;
            const donorEmail = donorEmailInput.value;
            const donorPhone = donorPhoneInput.value;
            const donorAddress = donorAddressInput.value;
            const donorPan = donorPanInput.value;
            const donationPurpose = donationPurposeInput.value;
            const isAnonymous = anonymousDonationCheckbox.checked;

            const options = {
                key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your actual Razorpay Key ID
                amount: amount * 100, // amount in smallest currency unit (paise)
                currency: 'INR',
                name: 'Nav Yug Nirman Foundation',
                description: donationPurpose || 'Donation',
                image: 'assets/images/logo.png',
                order_id: 'order_' + Date.now(), // Replace with a dynamically generated order ID from your backend
                handler: async function (response) {
                    const transaction = {
                        id: 'txn_' + Date.now(),
                        paymentId: response.razorpay_payment_id,
                        orderId: response.razorpay_order_id,
                        signature: response.razorpay_signature,
                        status: 'success',
                        date: new Date().toISOString(),
                        amount: amount,
                        purpose: donationPurpose || 'Donation',
                        name: isAnonymous ? 'Anonymous' : donorName,
                        email: isAnonymous ? 'anonymous@example.com' : donorEmail,
                        phone: isAnonymous ? 'N/A' : donorPhone,
                        address: isAnonymous ? 'N/A' : donorAddress,
                        pan: isAnonymous ? 'N/A' : donorPan,
                    };
                    saveTransaction(transaction);
                    showToast(languages[document.documentElement.lang].paymentSuccessful, 'success');

                    // Populate and generate receipt
                    const receiptNo = 'NYNF-' + Date.now().toString().slice(-8);
                    const receiptDate = new Date().toLocaleDateString(document.documentElement.lang === 'hi' ? 'hi-IN' : 'en-US');

                    document.getElementById('receipt-no').textContent = receiptNo;
                    document.getElementById('receipt-date').textContent = receiptDate;
                    document.getElementById('receipt-donor-name').textContent = isAnonymous ? languages[document.documentElement.lang].anonymousDonation : donorName;
                    document.getElementById('receipt-donor-email').textContent = isAnonymous ? '' : donorEmail;
                    document.getElementById('receipt-donor-phone').textContent = isAnonymous ? '' : donorPhone;
                    document.getElementById('receipt-donor-address').textContent = isAnonymous ? '' : donorAddress;
                    document.getElementById('receipt-amount').textContent = amount;
                    document.getElementById('receipt-transaction-ref').textContent = transaction.paymentId;

                    document.getElementById('download-receipt-btn').style.display = 'block';

                    donationForm.reset();
                    amountButtons.forEach(btn => btn.classList.remove('active'));
                    impactMessage.textContent = '';
                    localStorage.removeItem('donationFormDraft'); // Clear draft on successful submission
                    // Clear all validation styles after successful submission
                    document.querySelectorAll('.form-group').forEach(group => {
                        group.classList.remove('is-valid', 'is-invalid');
                        const error = group.querySelector('.error-message');
                        if (error) error.remove();
                    });
                },
                prefill: {
                    name: donorName,
                    email: donorEmail,
                    contact: donorPhone
                },
                notes: {
                    address: donorAddress,
                    pan: donorPan,
                    purpose: donationPurpose,
                    anonymous: isAnonymous ? 'Yes' : 'No'
                },
                theme: {
                    color: '#FFA500'
                }
            };

            const rzp = new Razorpay(options);
            rzp.on('razorpay_payment_failed', function (response){
                const transaction = {
                    id: 'txn_' + Date.now(),
                    paymentId: response.error.metadata.payment_id,
                    orderId: response.error.metadata.order_id,
                    status: 'failed',
                    date: new Date().toISOString(),
                    amount: amount,
                    purpose: donationPurpose || 'Donation',
                    name: isAnonymous ? 'Anonymous' : donorName,
                    email: isAnonymous ? 'anonymous@example.com' : donorEmail,
                    phone: isAnonymous ? 'N/A' : donorPhone,
                    address: isAnonymous ? 'N/A' : donorAddress,
                    pan: isAnonymous ? 'N/A' : donorPan,
                    error: response.error.description
                };
                saveTransaction(transaction);
                showToast(languages[document.documentElement.lang].paymentFailed + ': ' + response.error.description, 'error');
            });
            rzp.on('razorpay_payment_cancelled', function(){
                showToast(languages[document.documentElement.lang].paymentCancelled, 'info');
            });
            rzp.open();
        });

        document.getElementById('download-receipt-btn').addEventListener('click', () => {
            generatePdfFromHtml('donation-receipt-template', 'Donation_Receipt.pdf');
        });

        function updateImpactMessage(amount) {
            let message = '';
            if (amount >= 5000) {
                message = 'This can provide a full month of educational supplies for a child.';
            } else if (amount >= 2000) {
                message = 'This can fund a health check-up for a family.';
            } else if (amount >= 1000) {
                message = 'This can provide a week of nutritious meals for a student.';
            } else if (amount >= 500) {
                message = 'This can provide essential school supplies for a child.';
            }
            impactMessage.textContent = message;
        }

        loadDonationDraft(); // Load draft on page load
    }

    // Membership Page
    const membershipForm = document.getElementById('membership-form');
    if (membershipForm) {
        const memberNameInput = document.getElementById('member-name');
        const memberEmailInput = document.getElementById('member-email');
        const memberPhoneInput = document.getElementById('member-phone');
        const membershipTypeSelect = document.getElementById('membership-type');
        const memberPhotoInput = document.getElementById('member-photo');

        const saveMembershipDraft = () => {
            const draft = {
                name: memberNameInput.value,
                email: memberEmailInput.value,
                phone: memberPhoneInput.value,
                type: membershipTypeSelect.value,
                // Note: File inputs cannot directly save file data to localStorage for security reasons.
                // You might save the file name or a flag if a file was selected, but not the file itself.
            };
            localStorage.setItem('membershipFormDraft', JSON.stringify(draft));
        };

        const loadMembershipDraft = () => {
            const draft = JSON.parse(localStorage.getItem('membershipFormDraft'));
            if (draft) {
                memberNameInput.value = draft.name || '';
                memberEmailInput.value = draft.email || '';
                memberPhoneInput.value = draft.phone || '';
                membershipTypeSelect.value = draft.type || 'general';
            }
        };

        const validateMembershipForm = () => {
            let isValid = true;
            isValid = validateField(memberNameInput) && isValid;
            isValid = validateField(memberEmailInput) && isValid;
            isValid = validateField(memberPhoneInput) && isValid;
            isValid = validateField(membershipTypeSelect) && isValid;
            // Photo is optional, so no validation needed unless it becomes required
            return isValid;
        };

        memberNameInput.addEventListener('input', () => { validateField(memberNameInput); saveMembershipDraft(); });
        memberEmailInput.addEventListener('input', () => { validateField(memberEmailInput); saveMembershipDraft(); });
        memberPhoneInput.addEventListener('input', () => { validateField(memberPhoneInput); saveMembershipDraft(); });
        membershipTypeSelect.addEventListener('change', () => { validateField(membershipTypeSelect); saveMembershipDraft(); });

        membershipForm.addEventListener('submit', async (e) => {            e.preventDefault();            if (!validateMembershipForm()) {                showToast(languages[document.documentElement.lang].pleaseCorrectErrors, 'error');                return;            }            const memberName = memberNameInput.value;            const memberEmail = memberEmailInput.value;            const memberPhone = memberPhoneInput.value;            const membershipType = membershipTypeSelect.value;            let amount = 0;            let purpose = '';            switch (membershipType) {                case 'general':                    amount = 1000; // ₹1,000/year                    purpose = 'General Membership';                    break;                case 'life':                    amount = 10000; // ₹10,000 (one-time)                    purpose = 'Life Membership';                    break;                case 'patron':                    amount = 50000; // ₹50,000 (one-time)                    purpose = 'Patron Membership';                    break;            }            const options = {                key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your actual Razorpay Key ID                amount: amount * 100, // amount in smallest currency unit (paise)                currency: 'INR',                name: 'Nav Yug Nirman Foundation',                description: purpose,                image: 'assets/images/logo.png',                order_id: 'order_' + Date.now(), // Replace with a dynamically generated order ID from your backend                handler: async function (response) {                    const transaction = {                        id: 'txn_' + Date.now(),                        paymentId: response.razorpay_payment_id,                        orderId: response.razorpay_order_id,                        signature: response.razorpay_signature,                        status: 'success',                        date: new Date().toISOString(),                        amount: amount,                        purpose: purpose,                        name: memberName,                        email: memberEmail,                        phone: memberPhone,                    };                    saveTransaction(transaction);                    showToast(languages[document.documentElement.lang].paymentSuccessful, 'success');                    // Generate Member ID                    const memberId = 'NYNF-2025-' + Math.floor(1000 + Math.random() * 9000);                    const issueDate = new Date().toLocaleDateString(document.documentElement.lang === 'hi' ? 'hi-IN' : 'en-US');                    let validUntil = 'N/A';                    if (membershipType === 'general') {                        const expiry = new Date();                        expiry.setFullYear(expiry.getFullYear() + 1);                        validUntil = expiry.toLocaleDateString(document.documentElement.lang === 'hi' ? 'hi-IN' : 'en-US');                    } else if (membershipType === 'life' || membershipType === 'patron') {                        validUntil = 'Lifetime';                    }                    // Populate Certificate Template                    document.getElementById('certificate-member-name').textContent = memberName;                    document.getElementById('certificate-membership-category').textContent = membershipType.charAt(0).toUpperCase() + membershipType.slice(1) + ' Member';                    document.getElementById('certificate-member-id').textContent = memberId;                    document.getElementById('certificate-issue-date').textContent = issueDate;                    document.getElementById('certificate-valid-until').textContent = validUntil;                    // Generate QR code for Certificate                    const certificateQrData = `Member ID: ${memberId}\nName: ${memberName}\nType: ${membershipType}\nIssue Date: ${issueDate}\nValid Until: ${validUntil}`; // Add certificate URL if available                    generateQRCode('certificate-qr-code', certificateQrData);                    // Populate ID Card Template                    document.getElementById('id-card-member-name').textContent = memberName;                    document.getElementById('id-card-member-id').textContent = memberId;                    document.getElementById('id-card-membership-category').textContent = membershipType.charAt(0).toUpperCase() + membershipType.slice(1);                    document.getElementById('id-card-issue-date').textContent = issueDate;                    document.getElementById('id-card-expiry-date').textContent = validUntil;                    // Handle photo for ID Card                    if (memberPhotoInput.files && memberPhotoInput.files[0]) {                        const reader = new FileReader();                        reader.onload = (e) => {                            document.getElementById('id-card-photo').src = e.target.result;                        };                        reader.readAsDataURL(memberPhotoInput.files[0]);                    }                    // Generate QR code for ID Card                    const idCardQrData = `Member ID: ${memberId}\nName: ${memberName}\nType: ${membershipType}\nValid Until: ${validUntil}`; // Add certificate URL if available                    generateQRCode('id-card-qr-code', idCardQrData);                    document.getElementById('download-certificate-btn').style.display = 'block';                    document.getElementById('download-id-card-btn').style.display = 'block';                    membershipForm.reset();                    localStorage.removeItem('membershipFormDraft'); // Clear draft on successful submission                    // Clear all validation styles after successful submission                    document.querySelectorAll('.form-group').forEach(group => {                        group.classList.remove('is-valid', 'is-invalid');                        const error = group.querySelector('.error-message');                        if (error) error.remove();                    });                },                prefill: {                    name: memberName,                    email: memberEmail,                    contact: memberPhone                },                notes: {                    membershipType: membershipType,                },                theme: {                    color: '#2E8B57' // Green for membership                }            };            const rzp = new Razorpay(options);            rzp.on('razorpay_payment_failed', function (response){                const transaction = {                    id: 'txn_' + Date.now(),                    paymentId: response.error.metadata.payment_id,                    orderId: response.error.metadata.order_id,                    status: 'failed',                    date: new Date().toISOString(),                    amount: amount,                    purpose: purpose,                    name: memberName,                    email: memberEmail,                    phone: memberPhone,                    error: response.error.description                };                saveTransaction(transaction);                showToast(languages[document.documentElement.lang].paymentFailed + ': ' + response.error.description, 'error');            });            rzp.on('razorpay_payment_cancelled', function(){                showToast(languages[document.documentElement.lang].paymentCancelled, 'info');            });            rzp.open();        });

        document.getElementById('download-certificate-btn').addEventListener('click', () => {
            generatePdfFromHtml('membership-certificate-template', 'Membership_Certificate.pdf');
        });

        document.getElementById('download-id-card-btn').addEventListener('click', () => {
            generatePdfFromHtml('member-id-card-template', 'Member_ID_Card.pdf');
        });

        loadMembershipDraft(); // Load draft on page load

        const previewCertificateLink = document.getElementById('preview-certificate');
        if (previewCertificateLink) {
            previewCertificateLink.addEventListener('click', (e) => {
                e.preventDefault();
                const certificateImageSrc = previewCertificateLink.querySelector('img').src;
                const previewModal = createModal({
                    id: 'certificate-preview-modal',
                    title: 'Certificate Preview',
                    content: `<img src="${certificateImageSrc}" alt="Certificate Preview" style="max-width:100%; height:auto;">`,
                    type: 'preview'
                });
                openModal(previewModal);
            });
        }
    }

    // Transaction Management
    const saveTransaction = (transaction) => {
        let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));
    };

    const getTransactions = () => {
        return JSON.parse(localStorage.getItem('transactions')) || [];
    };

    // Transaction History Page
    const transactionsPage = document.querySelector('main section.container');
    if (transactionsPage && document.title.includes('Transaction History')) {
        const transactionsTableBody = document.getElementById('transactions-table-body');
        const noTransactionsMessage = document.getElementById('no-transactions-message');
        const searchInput = document.getElementById('search-transactions');
        const statusFilter = document.getElementById('status-filter');
        const exportCsvBtn = document.getElementById('export-csv-btn');

        const renderTransactions = () => {
            let transactions = getTransactions();
            const searchTerm = searchInput.value.toLowerCase();
            const filterStatus = statusFilter.value;

            const filteredTransactions = transactions.filter(transaction => {
                const matchesSearch = (transaction.id.toLowerCase().includes(searchTerm) ||
                                     transaction.name.toLowerCase().includes(searchTerm) ||
                                     transaction.email.toLowerCase().includes(searchTerm) ||
                                     transaction.phone.toLowerCase().includes(searchTerm) ||
                                     transaction.purpose.toLowerCase().includes(searchTerm));
                const matchesStatus = (filterStatus === 'all' || transaction.status === filterStatus);
                return matchesSearch && matchesStatus;
            });

            transactionsTableBody.innerHTML = '';
            if (filteredTransactions.length === 0) {
                noTransactionsMessage.style.display = 'block';
            } else {
                noTransactionsMessage.style.display = 'none';
                filteredTransactions.forEach(transaction => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${transaction.id}</td>
                        <td>${transaction.paymentId || 'N/A'}</td>
                        <td>${transaction.orderId || 'N/A'}</td>
                        <td><span class="status-${transaction.status}">${transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</span></td>
                        <td>${new Date(transaction.date).toLocaleString()}</td>
                        <td>₹${transaction.amount.toFixed(2)}</td>
                        <td>${transaction.purpose}</td>
                        <td>${transaction.name}</td>
                        <td>${transaction.email}</td>
                        <td>${transaction.phone}</td>
                        <td>
                            <button class="btn btn-sm btn-primary generate-doc-btn"
                                data-type="${transaction.purpose.includes('Donation') ? 'receipt' : 'membership'}"
                                data-transaction='${JSON.stringify(transaction)}'>
                                ${transaction.purpose.includes('Donation') ? languages[document.documentElement.lang].generateReceipt : languages[document.documentElement.lang].generateCertificate}
                            </button>
                        </td>
                    `;
                    transactionsTableBody.appendChild(row);
                });

                document.querySelectorAll('.generate-doc-btn').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const type = e.target.dataset.type;
                        const transactionData = JSON.parse(e.target.dataset.transaction);

                        if (type === 'receipt') {
                            // Populate receipt template
                            document.getElementById('receipt-no').textContent = transactionData.id;
                            document.getElementById('receipt-date').textContent = new Date(transactionData.date).toLocaleDateString(document.documentElement.lang === 'hi' ? 'hi-IN' : 'en-US');
                            document.getElementById('receipt-donor-name').textContent = transactionData.name;
                            document.getElementById('receipt-donor-email').textContent = transactionData.email;
                            document.getElementById('receipt-donor-phone').textContent = transactionData.phone;
                            document.getElementById('receipt-donor-address').textContent = transactionData.address || 'N/A';
                            document.getElementById('receipt-amount').textContent = transactionData.amount.toFixed(2);
                            document.getElementById('receipt-transaction-ref').textContent = transactionData.paymentId;
                            generatePdfFromHtml('donation-receipt-template', `Donation_Receipt_${transactionData.id}.pdf`);
                        } else if (type === 'membership') {
                            // Populate certificate template
                            document.getElementById('certificate-member-name').textContent = transactionData.name;
                            document.getElementById('certificate-membership-category').textContent = transactionData.purpose.replace(' Membership', '') + ' Member';
                            document.getElementById('certificate-member-id').textContent = transactionData.memberId || 'N/A'; // Assuming memberId is stored in transaction
                            document.getElementById('certificate-issue-date').textContent = new Date(transactionData.date).toLocaleDateString(document.documentElement.lang === 'hi' ? 'hi-IN' : 'en-US');
                            document.getElementById('certificate-valid-until').textContent = transactionData.validUntil || 'N/A'; // Assuming validUntil is stored

                            const certificateQrData = `Member ID: ${transactionData.memberId || 'N/A'}\nName: ${transactionData.name}\nType: ${transactionData.purpose}\nIssue Date: ${new Date(transactionData.date).toLocaleDateString()}\nValid Until: ${transactionData.validUntil || 'N/A'}`;
                            generateQRCode('certificate-qr-code', certificateQrData);
                            generatePdfFromHtml('membership-certificate-template', `Membership_Certificate_${transactionData.id}.pdf`);

                            // Populate ID Card Template
                            document.getElementById('id-card-member-name').textContent = transactionData.name;
                            document.getElementById('id-card-member-id').textContent = transactionData.memberId || 'N/A';
                            document.getElementById('id-card-membership-category').textContent = transactionData.purpose.replace(' Membership', '');
                            document.getElementById('id-card-issue-date').textContent = new Date(transactionData.date).toLocaleDateString(document.documentElement.lang === 'hi' ? 'hi-IN' : 'en-US');
                            document.getElementById('id-card-expiry-date').textContent = transactionData.validUntil || 'N/A';

                            // Note: Photo cannot be regenerated from transaction data unless stored as base64, which is not recommended for localStorage.
                            // For a real app, photo would be stored on a server and fetched here.
                            // document.getElementById('id-card-photo').src = transactionData.photoUrl || 'assets/images/default-avatar.png';

                            const idCardQrData = `Member ID: ${transactionData.memberId || 'N/A'}\nName: ${transactionData.name}\nType: ${transactionData.purpose}\nValid Until: ${transactionData.validUntil || 'N/A'}`;
                            generateQRCode('id-card-qr-code', idCardQrData);
                            generatePdfFromHtml('member-id-card-template', `Member_ID_Card_${transactionData.id}.pdf`);
                        }
                    });
                });
            }
        };

        searchInput.addEventListener('input', renderTransactions);
        statusFilter.addEventListener('change', renderTransactions);
        exportCsvBtn.addEventListener('click', () => {
            let transactions = getTransactions();
            const searchTerm = searchInput.value.toLowerCase();
            const filterStatus = statusFilter.value;

            const filteredTransactions = transactions.filter(transaction => {
                const matchesSearch = (transaction.id.toLowerCase().includes(searchTerm) ||
                                     transaction.name.toLowerCase().includes(searchTerm) ||
                                     transaction.email.toLowerCase().includes(searchTerm) ||
                                     transaction.phone.toLowerCase().includes(searchTerm) ||
                                     transaction.purpose.toLowerCase().includes(searchTerm));
                const matchesStatus = (filterStatus === 'all' || transaction.status === filterStatus);
                return matchesSearch && matchesStatus;
            });

            let csvContent = "Transaction ID,Payment ID,Order ID,Status,Date,Amount,Purpose,Name,Email,Phone,Address,PAN,Error\n";
            filteredTransactions.forEach(transaction => {
                csvContent += `${transaction.id},${transaction.paymentId || 'N/A'},${transaction.orderId || 'N/A'},${transaction.status},"${new Date(transaction.date).toLocaleString()}",${transaction.amount},"${transaction.purpose}","${transaction.name}","${transaction.email}","${transaction.phone}","${transaction.address || 'N/A'}","${transaction.pan || 'N/A'}","${transaction.error || 'N/A'}"\n`;
            });

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', 'transactions.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast('Transactions exported to CSV!', 'success');
        });

        renderTransactions(); // Initial render on page load
    }

    // Events Page
    const eventsPage = document.querySelector('#upcoming-events');
    if (eventsPage) {
        const upcomingEventsContainer = document.querySelector('#upcoming-events .event-list');
        const pastEventsContainer = document.querySelector('#past-events .event-gallery');
        const categoryFilter = document.getElementById('category-filter');
        const dateFilter = document.getElementById('date-filter');
        

        const events = [
            { name: 'Community Cleanup', date: '2025-09-15', category: 'environmental', description: 'Join us for a community cleanup event.', image: 'assets/images/event4.jpg', upcoming: true },
            { name: 'Free Health Check-up Camp', date: '2025-10-05', category: 'health', description: 'Free health check-ups for all.', image: 'assets/images/event1.jpg', upcoming: true },
            { name: 'Digital Literacy Workshop', date: '2025-08-20', category: 'educational', description: 'Learn basic computer skills.', image: 'assets/images/event2.jpg', upcoming: false },
            { name: 'Tree Plantation Drive', date: '2025-07-10', category: 'environmental', description: 'Planting trees for a greener future.', image: 'assets/images/event3.jpg', upcoming: false },
        ];

        function renderEvents() {
            upcomingEventsContainer.innerHTML = '';
            pastEventsContainer.innerHTML = '';

            const category = categoryFilter.value;
            const date = dateFilter.value;

            const filteredEvents = events.filter(event => {
                return (category === 'all' || event.category === category) &&
                       (!date || event.date === date);
            });

            filteredEvents.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.classList.add('event');

                if (event.upcoming) {
                    eventElement.innerHTML = `
                        <h3>${event.name}</h3>
                        <p>Date: ${event.date}</p>
                        <p>${event.description}</p>
                        <button class="btn btn-primary register-btn" data-event="${event.name}">Register</button>
                        <div class="social-share">
                            <a href="#" class="share-facebook"><i class="fab fa-facebook-f"></i></a>
                            <a href="#" class="share-twitter"><i class="fab fa-twitter"></i></a>
                        </div>
                    `;
                    upcomingEventsContainer.appendChild(eventElement);
                } else {
                    eventElement.innerHTML = `
                        <div class="card">
                            <img src="${event.image}" alt="${event.name}">
                            <div class="card-content">
                                <h3>${event.name}</h3>
                                <p>Date: ${event.date}</p>
                            </div>
                        </div>
                    `;
                    pastEventsContainer.appendChild(eventElement);
                }
            });

            addEventListeners();
        }

        function addEventListeners() {
            document.querySelectorAll('.register-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const eventName = e.target.dataset.event;
                    const modalContent = `
                        <form id="register-form">
                            <div class="form-group">
                                <label for="event-name">Event Name:</label>
                                <input type="text" id="event-name" class="form-control" value="${eventName}" readonly>
                            </div>
                            <div class="form-group">
                                <label for="participant-name">Your Name:</label>
                                <input type="text" id="participant-name" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label for="participant-email">Your Email:</label>
                                <input type="email" id="participant-email" class="form-control" required>
                            </div>
                            <button type="submit" class="btn btn-primary">Register</button>
                        </form>
                    `;

                    const registerModal = createModal({
                        id: 'event-register-modal',
                        title: `Register for ${eventName}`,
                        content: modalContent,
                        type: 'info'
                    });

                    openModal(registerModal);

                    const registerForm = document.getElementById('register-form');
                    const participantNameInput = document.getElementById('participant-name');
                    const participantEmailInput = document.getElementById('participant-email');

                    const validateRegisterForm = () => {
                        let isValid = true;
                        isValid = validateField(participantNameInput) && isValid;
                        isValid = validateField(participantEmailInput) && isValid;
                        return isValid;
                    };

                    registerForm.addEventListener('submit', (event) => {
                        event.preventDefault();
                        if (validateRegisterForm()) {
                            showToast('Thank you for registering for the event!', 'success');
                            closeModal(registerModal);
                            registerForm.reset();
                            // Clear all validation styles after successful submission
                            document.querySelectorAll('.form-group').forEach(group => {
                                group.classList.remove('is-valid', 'is-invalid');
                                const error = group.querySelector('.error-message');
                                if (error) error.remove();
                            });
                        } else {
                            showToast('Please correct the errors in the form.', 'error');
                        }
                    });
                });
            });
        }

        categoryFilter.addEventListener('change', renderEvents);
        dateFilter.addEventListener('change', renderEvents);

        renderEvents();
    }

    // Contact Page
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const contactNameInput = document.getElementById('contact-name');
        const contactEmailInput = document.getElementById('contact-email');
        const contactSubjectInput = document.getElementById('contact-subject');
        const contactMessageInput = document.getElementById('contact-message');

        const validateContactForm = () => {
            let isValid = true;
            isValid = validateField(contactNameInput) && isValid;
            isValid = validateField(contactEmailInput) && isValid;
            isValid = validateField(contactSubjectInput) && isValid;
            isValid = validateField(contactMessageInput) && isValid;
            return isValid;
        };

        contactNameInput.addEventListener('input', () => { validateField(contactNameInput); });
        contactEmailInput.addEventListener('input', () => { validateField(contactEmailInput); });
        contactSubjectInput.addEventListener('input', () => { validateField(contactSubjectInput); });
        contactMessageInput.addEventListener('input', () => { validateField(contactMessageInput); });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateContactForm()) {
                const successModal = createModal({
                    id: 'contact-success-modal',
                    title: 'Message Sent!',
                    content: '<p>Thank you for contacting us. We will get back to you shortly.</p>',
                    type: 'info'
                });
                openModal(successModal);
                contactForm.reset();
                // Clear all validation styles after successful submission
                document.querySelectorAll('.form-group').forEach(group => {
                    group.classList.remove('is-valid', 'is-invalid');
                    const error = group.querySelector('.error-message');
                    if (error) error.remove();
                });
                showToast('Message sent successfully!', 'success');
            } else {
                showToast('Please correct the errors in the form.', 'error');
            }
        });
    }

    // Toast Notification
    function showToast(message, type = 'info', duration = 3000) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = 'toast show'; // Reset classes and add show
        toast.classList.add(type);

        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.remove(type);
        }, duration);
    }

    // Modal Functions
    function createModal({ id, title, content, type = 'info' }) {
        let modal = document.getElementById(id);
        if (!modal) {
            modal = document.createElement('div');
            modal.id = id;
            modal.classList.add('modal');
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-button">&times;</span>
                    <h2>${title}</h2>
                    <div class="modal-body">${content}</div>
                </div>
            `;
            document.body.appendChild(modal);

            modal.querySelector('.close-button').addEventListener('click', () => {
                closeModal(modal);
            });
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        }
        return modal;
    }

    function openModal(modal) {
        modal.style.display = 'block';
    }

    function closeModal(modal) {
        modal.style.display = 'none';
    }

    // Generic PDF generation from HTML element
    async function generatePdfFromHtml(elementId, filename) {
        const element = document.getElementById(elementId);
        if (!element) {
            showToast(`Error: Element with ID ${elementId} not found for PDF generation.`, 'error');
            return;
        }

        // Temporarily make the element visible for html2canvas
        element.style.display = 'block';
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        element.style.top = '-9999px';

        try {
            const canvas = await html2canvas(element, { scale: 2 }); // Scale for higher resolution
            const imgData = canvas.toDataURL('image/png');
            const pdf = new window.jspdf.jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(filename);
            showToast(`${filename} generated successfully!`, 'success');
        } catch (error) {
            console.error('Error generating PDF:', error);
            showToast(`Failed to generate ${filename}.`, 'error');
        } finally {
            // Hide the element again
            element.style.display = 'none';
            element.style.position = '';
            element.style.left = '';
            element.style.top = '';
        }
    }

    // QR Code Generation
    function generateQRCode(elementId, text) {
        const qrCodeContainer = document.getElementById(elementId);
        if (qrCodeContainer) {
            qrCodeContainer.innerHTML = ''; // Clear previous QR code
            new QRCode(qrCodeContainer, {
                text: text,
                width: 128,
                height: 128,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
        }
    }

    // Example of copy to clipboard functionality with toast
    const copyButtons = document.querySelectorAll('[data-copy]');
    copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const textToCopy = button.dataset.copy;
            try {
                await navigator.clipboard.writeText(textToCopy);
                showToast('Copied to clipboard!', 'success');
            } catch (err) {
                showToast('Failed to copy.', 'error');
            }
        });
    });
});
