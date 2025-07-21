import React, { useEffect, useState } from 'react';
import './statsbanner.css';

const statsData = [
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.67c.12-.24.232-.487.335-.737M12 12c-1.832 0-3.463-.923-4.5-2.251s-1.481-3.132 0-4.498C8.537 2.923 10.168 2 12 2c1.832 0 3.463.923 4.5 2.251s1.481 3.132 0 4.498C15.463 11.077 13.832 12 12 12z" />
            </svg>
        ),
        value: 100,
        suffix: '+',
        label: 'Peşəkar usta',
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        value: 50,
        suffix: '+',
        label: 'Məmnun sifariş',
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.117 1.243H4.252c-.654 0-1.187-.585-1.117-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.117 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
        ),
        value: 50,
        suffix: '+',
        label: 'Xidmət növü',
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.31h5.418a.563.563 0 01.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 21.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988h5.418a.563.563 0 00.475-.31L11.48 3.5z" />
            </svg>
        ),
        value: 4.8,
        suffix: '/5',
        label: 'Reytinq',
    },
];

const CountUp = ({ value, suffix }) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        if (!hasAnimated) {
            const duration = 2000;
            const start = 0;
            const increment = value / (duration / 16);

            let current = start;
            const timer = setInterval(() => {
                current += increment;
                if (current >= value) {
                    clearInterval(timer);
                    current = value;
                    setHasAnimated(true);
                }
                setCount(Math.floor(current));
            }, 16);

            return () => clearInterval(timer);
        }
    }, [value, hasAnimated]);

    return (
        <span className="stat-value">
            {value % 1 === 0 ? count : value.toFixed(1)}
            {suffix}
        </span>
    );
};

const StatsBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const element = document.querySelector('.stats-banner');
            if (element) {
                const rect = element.getBoundingClientRect();
                setIsVisible(rect.top <= window.innerHeight * 0.75);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); 
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section className={`stats-banner ${isVisible ? 'visible' : ''}`}>
            <div className="stats-container">
                {statsData.map((stat, index) => (
                    <div className="stat-item" key={index}>
                        <div className="stat-icon">{stat.icon}</div>
                        <div className="datas">
                            <h2 className="stat-value">
                                {isVisible ? (
                                    <CountUp value={stat.value} suffix={stat.suffix} />
                                ) : (
                                    <span>0{stat.suffix}</span>
                                )}
                            </h2>
                            <p className="stat-label">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default StatsBanner;