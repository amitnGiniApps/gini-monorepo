import Page from './Page';
import Chat from './Chat';
import Projects from './Projects'

function GiniAIPage() {
    return (
        <Page className="bg-gradient-to-b from-[#f9fafb] to-[#e9ecf1]">
            <Projects/>
            <Chat />
        </Page>
    );
}

export default GiniAIPage;
